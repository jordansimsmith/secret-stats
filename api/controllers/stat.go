package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/jordansimsmith/secret-stats/api/models"
)

/*
Struct StatController is an API controller for the
Stats collection.
*/
type StatController struct {
	db *gorm.DB
}

/*
Function NewStatController is the constructor for the
StatController struct. It injects the database provided and
returns a refrerence to the newly created struct.
*/
func NewStatController(db *gorm.DB) *StatController {
	var sc StatController
	sc.db = db
	return &sc
}

/*
Method All is responsible for handling the GET /stats endpoint.
It calculates all relevant statistics for the provided user_id.
Calculated statistics are returned in the response.
*/
func (sc *StatController) All(c *gin.Context) {

	// extract required user_id from query
	uid, err := strconv.ParseUint(c.Query("user_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid or missing user_id in path"})
		c.Abort()
		return
	}

	// check user exists
	if sc.db.First(&models.User{}, uid).RecordNotFound() {
		c.JSON(http.StatusNotFound, gin.H{"message": fmt.Sprintf("user with id %d not found", uid)})
		c.Abort()
		return
	}

	// get all the user's games from db
	var players []models.Player
	if err := sc.db.First(&models.User{}, uid).Preload("Game.Players").Related(&players).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// analyse games
	allStat := &models.Stat{}
	liberalStat := &models.Stat{}
	fascistStat := &models.Stat{}
	hitlerStat := &models.Stat{}

	for _, p := range players {
		// ignore orphaned players
		if p.GameID == 0 {
			continue
		}

		// record generic stats
		if p.Faction == p.Game.Winner {
			allStat.Win()
		} else {
			allStat.Lose()
		}

		// if player was liberal
		if p.Faction == "liberal" {
			if p.Faction == p.Game.Winner {
				liberalStat.Win()
			} else {
				liberalStat.Lose()
			}
		}

		// if player was non hitler fascist
		if p.Faction == "fascist" && !p.Hitler {
			if p.Faction == p.Game.Winner {
				fascistStat.Win()
			} else {
				fascistStat.Lose()
			}
		}

		// if player was hitler
		if p.Faction == "fascist" && p.Hitler {
			if p.Faction == p.Game.Winner {
				hitlerStat.Win()
			} else {
				hitlerStat.Lose()
			}
		}
	}

	// structure response
	response := gin.H{
		"all_games":                allStat,
		"liberal_games":            liberalStat,
		"fascist_non_hitler_games": fascistStat,
		"fascist_hitler_games":     hitlerStat,
	}

	// return results
	c.JSON(http.StatusOK, response)
}
