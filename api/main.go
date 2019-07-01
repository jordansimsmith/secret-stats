package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/jordansimsmith/are-you-hitler/api/controllers"
	"github.com/jordansimsmith/are-you-hitler/api/models"
)

var (
	MYSQL_USER     = os.Getenv("MYSQL_USER")
	MYSQL_PASSWORD = os.Getenv("MYSQL_PASSWORD")
	MYSQL_DATABASE = os.Getenv("MYSQL_DATABASE")
	MYSQL_HOST     = "mariadb"
	MYSQL_PORT     = 3306
)

func main() {
	fmt.Println("Are You Hitler? API starting.")

	// gorm initialisation
	url := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8&parseTime=True&loc=Local", MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE)
	db, err := gorm.Open("mysql", url)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	fmt.Println("Successfully connected to mariadb database")

	db.AutoMigrate(&models.User{}, &models.Player{}, &models.Game{})

	// gin initialisation
	r := gin.Default()

	user := controllers.NewUserController(db)

	r.GET("/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "hello world!",
		})
	})
	r.POST("/users", user.Create)
	r.GET("/users", user.All)
	r.GET("/users/:user_id", user.One)

	r.Run(":3000")
}
