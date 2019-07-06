import React from 'react';
import {
  Container,
  Header,
  Icon,
  Message,
  Divider,
  Card,
} from 'semantic-ui-react';
import axios from 'axios';
import {CreateGame} from '../components/CreateGame';
import {GameCard} from '../components/GameCard';

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

        <Card.Group>
          {games.map(game => (
            <GameCard key={game.game_id} game={game} onAction={this.getGames} />
          ))}
        </Card.Group>
      </Container>
    );
  }

  componentDidMount() {
    this.getGames();
  }

  getGames() {
    axios
      .get(`${API}/games`)
      .then(res => this.setState({games: res.data.reverse()}))
      .catch(error => this.setState({error}));
  }
}
