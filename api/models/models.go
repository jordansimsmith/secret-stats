package models

/*
Struct User represents a person registered in the system.
*/
type User struct {
	ID        uint
	FirstName string
	LastName  string
	Players   []Player
}

/*
Struct Player represents an instance of a User playing a game.
A Player is from factions 'liberal' or 'fascist'. If fascist, they
are either 'hitler' or not.
*/
type Player struct {
	ID      uint
	UserID  uint
	User    User
	GameID  uint
	Game    Game
	Faction string
	Hitler  bool
}

/*
Struct Game represents a record of a game between a group of Users.
The winner of the game is either 'liberal' or 'fascist'.
*/
type Game struct {
	ID         uint
	Timestamp  int64
	Winner     string
	NumPlayers uint
	Players    []Player
}
