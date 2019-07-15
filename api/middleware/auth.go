package middleware

import (
	"net/http"
	"os"

	"github.com/auth0-community/go-auth0"
	"github.com/gin-gonic/gin"
	"gopkg.in/square/go-jose.v2"
)

var (
	AUDIENCE = os.Getenv("AUTH0_API_IDENTIFIER")
	DOMAIN   = os.Getenv("AUTH0_DOMAIN")
)

/*
Function AuthRequired returns a gin middleware handler for auth0 authentication.
Auth0 audience and domain values must be set in the environment.
HTTP status 401 is returned if the request is not authorised.
*/
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {

		// initialise auth0 validator
		auth0Domain := "https://" + DOMAIN + "/"
		client := auth0.NewJWKClient(auth0.JWKClientOptions{URI: auth0Domain + ".well-known/jwks.json"}, nil)
		config := auth0.NewConfiguration(client, []string{AUDIENCE}, auth0Domain, jose.RS256)
		validator := auth0.NewValidator(config, nil)

		// validate request
		if _, err := validator.ValidateRequest(c.Request); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "unauthorised"})
			c.Abort()
			return
		}

		// request is valid
		c.Next()
	}
}
