import React from 'react';
import {Container, Header, Icon, Message, Divider} from 'semantic-ui-react';
import axios from 'axios';
import {CreateGame} from '../components/CreateGame';

const API = 'http://localhost:3000';

export class Games extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [],
      error: null,
    };

    this.getGames = this.getGames.bind(this);
  }

  render() {
    const {games, error} = this.state;

    return (
      <Container>
        <Header as="h1" icon textAlign="center">
          <Icon name="user secret" />
          <Header.Content>Games</Header.Content>
        </Header>

        <Divider />

        <CreateGame onCreate={this.getGames} />

        <Divider />

        <Message hidden={!error} color="red">
          <Message.Header>
            An error was encountered when fetching game data
          </Message.Header>
          <p>{error && error.message}</p>
        </Message>

        <ul>
          {games.map(game => (
            <li key={game.game_id}>
              {game.timestamp} {game.winner} {game.number_of_players}
            </li>
          ))}
        </ul>
      </Container>
    );
  }

  componentDidMount() {
    this.getGames();
  }

  getGames() {
    axios
      .get(`${API}/games`)
      .then(res => this.setState({games: res.data}))
      .catch(error => this.setState({error}));
  }
}
