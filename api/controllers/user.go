package controllers

import (
	"fmt"
	"net/http"
	"strconv"

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

	// unmarshal json payload
	var user models.User
	if c.BindJSON(&user) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid user object"})
		c.Abort()
		return
	}

	// input sanitisation
	if err := user.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// create user
	if err := uc.db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
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
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// success
	c.JSON(http.StatusOK, users)
}

/*
Method One is responsible for handling the GET /users/:user_id endpoint.
It returns the user identified by the id provided.
*/
func (uc *UserController) One(c *gin.Context) {

	// extract user_id from path
	uid, err := strconv.ParseUint(c.Param("user_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid user_id in path"})
		c.Abort()
		return
	}

	// find user from db
	var user models.User
	if err := uc.db.First(&user, uid).Error; err != nil {

		// if record not found
		if gorm.IsRecordNotFoundError(err) {
			c.JSON(http.StatusNotFound, gin.H{"message": fmt.Sprintf("user with id %d not found.", uid)})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		}
		c.Abort()
		return
	}

	// success
	c.JSON(http.StatusOK, user)
}

/*
Method Update is responsible for handling the PUT /users/:user_id endpoint.
It performs input sanitisation and updates the user by the values provided.
*/
func (uc *UserController) Update(c *gin.Context) {

	// extract user_id from path
	uid, err := strconv.ParseUint(c.Param("user_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid user_id in path"})
		c.Abort()
		return
	}

	// unmarshal json payload
	var user models.User
	if c.BindJSON(&user) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// input sanitisation
	if err := user.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// check if user exists
	if uc.db.First(&models.User{}, uid).RecordNotFound() {
		c.JSON(http.StatusNotFound, gin.H{"message": fmt.Sprintf("user with id %d not found.", uid)})
		c.Abort()
		return
	}

	// update user
	user.ID = uint(uid)
	if err := uc.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// success
	c.Status(http.StatusNoContent)
}

/*
Method Delete is responsible for handling the DELETE /users/:user_id endpoint.
It deletes the user from the database.
*/
func (uc *UserController) Delete(c *gin.Context) {

	// extract user_id from path
	uid, err := strconv.ParseUint(c.Param("user_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid user_id in path"})
		c.Abort()
		return
	}

	// check if user exists
	var user models.User
	if uc.db.First(&user, uid).RecordNotFound() {
		c.JSON(http.StatusNotFound, gin.H{"message": fmt.Sprintf("user with id %d not found.", uid)})
		c.Abort()
		return
	}

	// delete user
	if err := uc.db.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	// success
	c.Status(http.StatusNoContent)
}
