package models

import "errors"

/*
Struct User represents a person registered in the system.
*/
type User struct {
	ID        uint     `json:"user_id"`
	FirstName string   `json:"first_name"`
	LastName  string   `json:"last_name"`
	Players   []Player `json:"-"`
}

/*
Function Validate checks the integrity of each external (json) field
and returns an error if invalid. It is used to sanitise user input.
*/
func (u User) Validate() error {
	if u.ID != 0 {
		return errors.New("cannot provide an ID")
	}
	if u.FirstName == "" {
		return errors.New("first_name cannot be blank")
	}
	if u.LastName == "" {
		return errors.New("last_name cannot be blank")
	}
	return nil
}

/*
Struct Player represents an instance of a User playing a game.
A Player is from factions 'liberal' or 'fascist'. If fascist, they
are either 'hitler' or not.
*/
type Player struct {
	ID      uint   `json:"-"`
	UserID  uint   `json:"user_id"`
	User    User   `json:"-"`
	GameID  uint   `json:"-"`
	Game    Game   `json:"-"`
	Faction string `json:"faction"`
	Hitler  bool   `json:"hitler"`
}

/*
Struct Game represents a record of a game between a group of Users.
The winner of the game is either 'liberal' or 'fascist'.
*/
type Game struct {
	ID         uint     `json:"game_id"`
	Timestamp  int64    `json:"time_stamp"`
	Winner     string   `json:"winner"`
	NumPlayers uint     `json:"number_of_players"`
	Players    []Player `json:"players"`
}
