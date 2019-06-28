package models

/*
Struct User represents a person registered in the system.
*/
type User struct {
	ID        int    `json:"user_id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

/*
Struct Player represents an instance of a User playing a game.
A Player is from factions 'liberal' or 'fascist'. If fascist, they
are either 'hitler' or not.
*/
type Player struct {
	UserID  int    `json:"user_id"`
	Faction string `json:"faction"`
	Hitler  bool   `json:"hitler"`
}

/*
Struct Game represents a record of a game between a group of Users.
The winner of the game is either 'liberal' or 'fascist'.
*/
type Game struct {
	ID         int      `json:"game_id"`
	Timestamp  int64    `json:"timestamp"`
	Winner     string   `json:"winner"`
	NumPlayers int      `json:"number_of_players"`
	Players    []Player `json:"players"`
}
