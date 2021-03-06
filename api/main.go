package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/jordansimsmith/secret-stats/api/controllers"
	"github.com/jordansimsmith/secret-stats/api/middleware"
	"github.com/jordansimsmith/secret-stats/api/models"
)

var (
	MYSQL_USER     = os.Getenv("MYSQL_USER")
	MYSQL_PASSWORD = os.Getenv("MYSQL_PASSWORD")
	MYSQL_DATABASE = os.Getenv("MYSQL_DATABASE")
	MYSQL_HOST     = "mariadb"
	MYSQL_PORT     = 3306
)

func main() {
	fmt.Println("Secret Stats API starting.")

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
	c := cors.DefaultConfig()
	c.AllowAllOrigins = true
	c.AllowHeaders = []string{"Authorization", "content-type"}
	r.Use(cors.New(c))
	r.Use(middleware.AuthRequired())

	user := controllers.NewUserController(db)

	r.POST("/users", user.Create)
	r.GET("/users", user.All)
	r.GET("/users/:user_id", user.One)
	r.PUT("/users/:user_id", user.Update)
	r.DELETE("/users/:user_id", user.Delete)

	game := controllers.NewGameController(db)
	r.POST("/games", game.Create)
	r.GET("/games", game.All)
	r.GET("/games/:game_id", game.One)
	r.PUT("/games/:game_id", game.Update)
	r.DELETE("/games/:game_id", game.Delete)

	stat := controllers.NewStatController(db)
	r.GET("/stats", stat.All)

	r.Run(":3000")
}
