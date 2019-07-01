package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/jordansimsmith/are-you-hitler/api/models"
)

/*
Struct UserController is an API Controller for the Users
collection.
*/
type UserController struct {
	db *gorm.DB
}

/*
Function NewUserController is the constructor for the
UserController struct. It injects the database provided
and returns a reference to the newly created struct.
*/
func NewUserController(db *gorm.DB) *UserController {
	var uc UserController

	uc.db = db

	return &uc
}

/*
Method Create is responsible for handling the POST /users endpoint.
It performs input sanitisation and saves the new user to the database.
The generated user_id is returned in the response.
*/
func (uc *UserController) Create(c *gin.Context) {

	// unmarshall json payload
	var user models.User
	if c.BindJSON(&user) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid user object"})
		c.Abort()
		return
	}

	// input sanitisation
	if err := user.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err})
		c.Abort()
		return
	}

	// create user
	if err := uc.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		c.Abort()
		return
	}

	// success
	c.Header("Location", fmt.Sprintf("/users/%d", user.ID))
	c.JSON(http.StatusCreated, gin.H{"user_id": user.ID})
}

/*
Method All is responsible for handling the GET /users endpoint.
It returns all users, optionally filtering by first or last name.
*/
func (uc *UserController) All(c *gin.Context) {

	// extract optional search parameters from query
	searchParams := map[string]interface{}{}
	if firstName := c.Query("first_name"); firstName != "" {
		searchParams["first_name"] = firstName
	}
	if lastName := c.Query("last_name"); lastName != "" {
		searchParams["last_name"] = lastName
	}

	// find users from db
	var users []models.User
	if err := uc.db.Where(searchParams).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err})
		c.Abort()
		return
	}

	// success
	c.JSON(http.StatusCreated, users)
}
