import React from 'react';
import {
  Container,
  Header,
  Icon,
  Message,
  Divider,
  Card,
  Button,
} from 'semantic-ui-react';
import axios from 'axios';
import qs from 'query-string';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {CreateGame} from '../components/CreateGame';
import {GameCard} from '../components/GameCard';

const API = 'http://localhost:3000';

export class Games extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      games: [],
    };

    this.getGames = this.getGames.bind(this);
  }

  render() {
    const {games, error, user} = this.state;

    const allGames = () => {
      this.setState({user: undefined});
      this.getGames();
    };

    return (
      <Container>
        <Header as="h1" icon textAlign="center">
          <Icon name="user secret" />
          <Header.Content>
            {user ? `${user.first_name} ${user.last_name}'s Games` : 'Games'}
          </Header.Content>
          {user && (
            <Button as={Link} to="/games" onClick={allGames}>
              Show All Games
            </Button>
          )}
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
    // extract user_id from query
    const userID = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).user_id;

    userID && this.getUser(userID);
    userID ? this.getGames(userID) : this.getGames();
  }

  getUser(userID) {
    axios
      .get(`${API}/users/${userID}`)
      .then(res => this.setState({user: res.data}))
      .catch(error => this.setState({error}));
  }

  getGames(userID) {
    // structure request url
    const url = userID ? `${API}/games?user_id=${userID}` : `${API}/games`;

    axios
      .get(url)
      .then(res => this.setState({games: res.data.reverse()}))
      .catch(error => this.setState({error}));
  }
}
