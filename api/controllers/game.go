package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/jordansimsmith/are-you-hitler/api/models"
)

/*
Struct GameController is an API controller for the
Games collection.
*/
type GameController struct {
	db *gorm.DB
}

/*
Function NewGameController is the constructor for the
GameController struct. It injects the database provided and
returns a reference to the newly created struct.
*/
func NewGameController(db *gorm.DB) *GameController {
	var gc GameController
	gc.db = db
	return &gc
}

/*
Method Create is responsible for handling the POST /games endpoint.
It performs input sanitisation and saves the new game to the database.
The generated game_id is returned in the response.
*/
func (gc *GameController) Create(c *gin.Context) {

	// unmarshal json payload
	var game models.Game
	if c.BindJSON(&game) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid game object"})
		c.Abort()
		return
	}

	// sanitise game fields
	if err := game.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// check player foreign key constraints
	errs := make(chan error)
	for _, player := range game.Players {

		go func(p models.Player) {
			// check the user_ids exist
			if gc.db.First(&models.User{}, p.UserID).RecordNotFound() {
				errs <- errors.New(fmt.Sprintf("user with id %d not found", p.UserID))
			} else {
				errs <- nil
			}

		}(player)
	}

	// collect concurrent error checks
	for i := 0; i < len(game.Players); i++ {
		if err := <-errs; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"messge": err.Error()})
			c.Abort()
			return
		}
	}

	// create game
	if err := gc.db.Create(&game).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// success
	c.Header("location", fmt.Sprintf("/games/%d", game.ID))
	c.JSON(http.StatusCreated, gin.H{"game_id": game.ID})
}

/*
Method All is responsible for handling the GET /games endpoint.
It returns all games, optionally filtering by user_id.
*/
func (gc *GameController) All(c *gin.Context) {

	// games to return
	var games []models.Game

	// user_id query not set
	if c.Query("user_id") == "" {

		// query db for all games
		if err := gc.db.Preload("Players").Find(&games).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			c.Abort()
			return
		}
	} else {

		// user_id query is set
		uid, err := strconv.ParseUint(c.Query("user_id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "invalid user_id in query"})
			c.Abort()
			return
		}

		// find players for the user_id
		var players []models.Player
		if err := gc.db.First(&models.User{}, uid).Preload("Game.Players").Related(&players).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			c.Abort()
			return
		}

		// assemble output
		games = make([]models.Game, 0)
		for _, p := range players {
			// dont return empty games
			if p.Game.ID != 0 {
				games = append(games, p.Game)
			}
		}
	}

	// success
	c.JSON(http.StatusOK, games)
}

/*
Method One is responsible for handling the GET /games/:game_id endpoint.
It returns the user indentified by the id provided.
*/
func (gc *GameController) One(c *gin.Context) {

	// extract game_id parameter from path
	gid, err := strconv.ParseUint(c.Param("game_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid game_id in path"})
		c.Abort()
		return
	}

	// query db for game
	var game models.Game
	if err := gc.db.Preload("Players").First(&game, gid).Error; err != nil {

		// if record not found
		if gorm.IsRecordNotFoundError(err) {
			c.JSON(http.StatusNotFound, gin.H{"message": fmt.Sprintf("game with id %d not found", gid)})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		}
		c.Abort()
		return
	}

	// success
	c.JSON(http.StatusOK, game)
}

/*
Method Update is responsible for handling the PUT /games/:game_id endpoint.
It performs input sanitisation and updates the game by the values provided.
*/
func (gc *GameController) Update(c *gin.Context) {

	// extract game_id parameter from path
	gid, err := strconv.ParseUint(c.Param("game_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid game_id in path"})
		c.Abort()
		return
	}

	// unmarshal json payload
	var game models.Game
	if c.BindJSON(&game) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid game object"})
		c.Abort()
		return
	}

	// sanitise game fields
	if err := game.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// sanitise player fields
	errs := make(chan error)
	for _, player := range game.Players {

		go func(p models.Player) {
			// check the user_ids exist
			if gc.db.First(&models.User{}, p.UserID).RecordNotFound() {
				errs <- errors.New(fmt.Sprintf("user with id %d not found", p.UserID))
			} else {
				errs <- nil
			}

		}(player)
	}

	// collect concurrent error checks
	for i := 0; i < len(game.Players); i++ {
		if err := <-errs; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"messge": err.Error()})
			c.Abort()
			return
		}
	}

	// update game in db
	game.ID = uint(gid)
	if err := gc.db.Save(&game).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// update player associations
	if err := gc.db.Model(&game).Association("Players").Replace(game.Players).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// success
	c.Status(http.StatusNoContent)
}

/*
Method Delete is responsible for handling the DELETE /games/:game_id endpoint.It deletes the game (and its players) from the database.
*/
func (gc *GameController) Delete(c *gin.Context) {

	// extract game_id parameter from path
	gid, err := strconv.ParseUint(c.Param("game_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid game_id in path"})
		c.Abort()
		return
	}

	// check if game exists
	var game models.Game
	if gc.db.First(&game, gid).RecordNotFound() {
		c.JSON(http.StatusNotFound, gin.H{"message": fmt.Sprintf("game with id %d not found", gid)})
		c.Abort()
		return
	}

	// delete game from database
	if err := gc.db.Delete(&game).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// success
	c.Status(http.StatusNoContent)
}
