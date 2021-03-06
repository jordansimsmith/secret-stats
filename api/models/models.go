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
Method Validate checks the integrity of each external (json) field
and returns an error if invalid. It is used to sanitise user input.
*/
func (u User) Validate() error {
	if u.ID != 0 {
		return errors.New("ID is generated, not supplied")
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
Method Player checks the integrity of each external (json) field
supplied by the client. It returns an error if invalid.
*/
func (p Player) Validate() error {
	if p.Faction != "fascist" && p.Faction != "liberal" {
		return errors.New("faction must be one of 'fascist' or 'liberal'")
	}
	if p.UserID == 0 {
		return errors.New("user_id cannot be blank")
	}
	if p.Hitler && p.Faction != "fascist" {
		return errors.New("hitler must be a fascist")
	}
	return nil
}

/*
Struct Game represents a record of a game between a group of Users.
The winner of the game is either 'liberal' or 'fascist'.
*/
type Game struct {
	ID         uint     `json:"game_id"`
	Timestamp  uint64   `json:"timestamp"`
	Winner     string   `json:"winner"`
	NumPlayers uint     `json:"number_of_players"`
	Players    []Player `json:"players"`
}

/*
Method Validate checks the integrity of each external (json) field
and returns an error if invalid. It only checks the fields supplied
by the client.
*/
func (g Game) Validate() error {
	// validate game fields
	if g.ID != 0 {
		return errors.New("ID is generated, not supplied")
	}
	if g.Timestamp == 0 {
		return errors.New("timestamp not provided")
	}
	if g.Winner != "fascist" && g.Winner != "liberal" {
		return errors.New("winner must be one of 'fascist' or 'liberal'")
	}
	if g.NumPlayers != uint(len(g.Players)) {
		return errors.New("inconsistent number of players")
	}

	// validate constraints in player fields
	hitlers := 0
	users := make(map[uint]bool)
	for _, p := range g.Players {
		// check player integrity
		if err := p.Validate(); err != nil {
			return err
		}

		// check for duplicate users
		if _, ok := users[p.UserID]; ok {
			return errors.New("duplicate players")
		} else {
			users[p.UserID] = true
		}

		// count hitlers
		if p.Hitler {
			hitlers++
		}
	}

	// must be only one hitler
	if hitlers != 1 {
		return errors.New("must be exactly one hitler")
	}

	// valid game
	return nil
}

/*
Struct Stat represents a summary of a user's performance in a given
situation (e.g. liberal, fascist etc.).
*/
type Stat struct {
	Played  uint    `json:"games_played"`
	Won     uint    `json:"games_won"`
	Lost    uint    `json:"games_lost"`
	WinRate float32 `json:"win_rate"`
}

/*
Method Win adds a record of a win to the current stat.
*/
func (s *Stat) Win() {
	s.Played++
	s.Won++
	s.calculateWinRate()
}

/*
Method Lose adds a record of a lose to the current stat.
*/
func (s *Stat) Lose() {
	s.Played++
	s.Lost++
	s.calculateWinRate()
}

func (s *Stat) calculateWinRate() {
	wr := float32(s.Won) / float32(s.Played)
	s.WinRate = wr
}
