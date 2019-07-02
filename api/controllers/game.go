package controllers

import (
	"errors"
	"fmt"
	"net/http"

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

	// sanitise player fields
	errs := make(chan error)
	hitlers := 0
	for _, player := range game.Players {

		go func(p models.Player) {
			// check player fields
			errs <- p.Validate()

			// check the user_ids exist
			if gc.db.First(&models.User{}, p.UserID).RecordNotFound() {
				errs <- errors.New(fmt.Sprintf("user with id %d not found", p.UserID))
			} else {
				errs <- nil
			}

		}(player)

		// count the number of hitlers
		if player.Hitler {
			hitlers++
		}
	}

	// collect concurrent error checks
	for i := 0; i < 2*len(game.Players); i++ {
		if err := <-errs; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"messge": err.Error()})
			c.Abort()
			return
		}
	}

	// must be only one hitler
	if hitlers != 1 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "must be only 1 hitler"})
		c.Abort()
		return
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
