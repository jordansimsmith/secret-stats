import React from 'react';
import {Card, Button, Confirm} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import axios from 'axios';

const API = 'http://localhost:3000';

export class GameCard extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    onAction: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmOpen: false,
    };

    this.deleteGame = this.deleteGame.bind(this);
  }

  render() {
    const {game} = this.props;
    const {confirmOpen} = this.state;

    return (
      <Card>
        <Card.Content>
          <Card.Header>
            {new Date(game.timestamp * 1000).toLocaleString()}
          </Card.Header>
          <Card.Meta>{game.number_of_players} player game</Card.Meta>
          <Card.Description>
            {game.winner.toUpperCase()} victory!
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button color="blue">Details</Button>
          <Button color="orange">Edit</Button>
          <Button color="red" onClick={this.open}>
            Delete
          </Button>
          <Confirm
            open={confirmOpen}
            onCancel={this.close}
            onConfirm={this.deleteGame}
          />
        </Card.Content>
      </Card>
    );
  }

  open = () => this.setState({confirmOpen: true});
  close = () => this.setState({confirmOpen: false});

  deleteGame() {
    const id = this.props.game.game_id;
    const {onAction} = this.props;

    axios
      .delete(`${API}/games/${id}`)
      .then(onAction)
      .then(this.close)
      .catch(error => this.setState({error}));
  }
}
