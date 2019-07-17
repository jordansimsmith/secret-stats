import React from 'react';
import {
  Container,
  Header,
  Icon,
  Message,
  Divider,
  Card,
  Button,
  Form,
  Select,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import qs from 'query-string';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {CreateGame} from '../components/CreateGame';
import {GameCard} from '../components/GameCard';
import {GameDetails} from '../components/GameDetails';
import API from '../shared/apiAdapter';

export class Games extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    // extract user_id from query
    const userID = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).user_id;

    this.state = {
      userID: parseInt(userID, 10),
      users: [],
      games: [],
      isLoading: false,
    };

    this.getGames = this.getGames.bind(this);
  }

  render() {
    const {
      games,
      error,
      user,
      users,
      userID,
      focusedGame,
      isLoading,
    } = this.state;

    const userOptions = users.map(user => ({
      text: `${user.first_name} ${user.last_name}`,
      value: user.user_id,
    }));

    return (
      <div className="content-wrap">
        <Container>
          <Header as="h1" icon textAlign="center">
            <Icon name="game" />
            <Header.Content>
              {user ? `${user.first_name} ${user.last_name}'s Games` : 'Games'}
            </Header.Content>
            {user && (
              <Button as={Link} to="/games" onClick={this.allGames}>
                Show All Games
              </Button>
            )}
          </Header>

          <Form>
            <Form.Input
              placeholder="Choose a user to display games for"
              control={Select}
              options={userOptions}
              name="userID"
              value={userID || ''}
              onChange={this.onChange}
            />
          </Form>

          <Divider />

          <div className="center">
            <CreateGame onCreate={this.onAction(userID)} />
          </div>

          <Divider />

          <Dimmer inverted active={isLoading}>
            <Loader>Loading Games</Loader>
          </Dimmer>

          {focusedGame && (
            <GameDetails
              game={focusedGame}
              users={users}
              close={this.closeDetail}
            />
          )}

          <Message hidden={!error} color="red">
            <Message.Header>
              An error was encountered when fetching game data
            </Message.Header>
            <p>{error && error.message}</p>
            {error && error.response && (
              <p> Message: {error.response.data.message}</p>
            )}
          </Message>

          <Card.Group stackable itemsPerRow={3}>
            {games.map(game => (
              <GameCard
                key={game.game_id}
                game={game}
                onAction={this.onAction(userID)}
                openDetail={this.openDetail(game)}
              />
            ))}
          </Card.Group>
        </Container>
      </div>
    );
  }
  openDetail = game => () => this.setState({focusedGame: game});

  closeDetail = () => this.setState({focusedGame: undefined});

  onAction = userID => () => {
    userID ? this.getGames(userID) : this.getGames();
    this.setState({focusedGame: undefined});
  };

  onChange = (e, data) => {
    const userID = data.value;

    this.setState({
      [data.name]: userID,
    });

    // change query url
    this.props.history.push(`/games?user_id=${userID}`);

    // reload games
    this.getUser(userID);
    this.getGames(userID);
  };

  allGames = () => {
    this.setState({user: undefined, userID: undefined});
    this.getGames();
  };

  componentDidMount() {
    const {userID} = this.state;
    this.setState({isLoading: true});
    this.getUsers();
    userID && this.getUser(userID);
    userID ? this.getGames(userID) : this.getGames();
  }

  getUser(userID) {
    API.getUser(userID)
      .then(res => this.setState({user: res.data}))
      .catch(error => this.setState({error}));
  }

  getUsers() {
    API.getUsers()
      .then(res => this.setState({users: res.data}))
      .catch(error => this.setState({error}));
  }

  getGames(userID) {
    API.getGames(userID)
      .then(res => this.setState({games: res.data.reverse(), isLoading: false}))
      .catch(error => this.setState({error, isLoading: false}));
  }
}
