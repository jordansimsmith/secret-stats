import React from 'react';
import {Button, Form, Modal, Message, Select} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {PlayerField} from './PlayerField';

const API = 'http://localhost:3000';

export class GameForm extends React.Component {
  static propTypes = {
    trigger: PropTypes.node.isRequired,
    header: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
    after: PropTypes.func,
    game: PropTypes.object,
    users: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    // get game information from props or set defaults
    const {game} = this.props;
    const timestamp = game ? game.timestamp : new Date().getTime();
    const winner = game ? game.winner : '';
    const numberOfPlayers = game ? game.number_of_players : 0;
    const players = game ? game.players : [];

    this.state = {
      isLoading: false,
      error: null,
      success: false,
      timestamp: timestamp,
      winner: winner,
      numberOfPlayers: numberOfPlayers,
      players: players,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.newPlayer = this.newPlayer.bind(this);
    this.deletePlayer = this.deletePlayer.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  render() {
    const {trigger, header, users} = this.props;
    const {isLoading, error, success, timestamp, winner, players} = this.state;

    const factions = [
      {text: 'Liberal', value: 'liberal'},
      {text: 'Fascist', value: 'fascist'},
    ];

    return (
      <Modal trigger={trigger}>
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>
          <Form loading={isLoading} error={!!error} success={success}>
            <Form.Input
              label="Time Stamp"
              placeholder="Time Stamp"
              name="timestamp"
              value={timestamp || ''}
              onChange={this.handleInputChange}
            />
            <Form.Input
              label="Winner"
              control={Select}
              options={factions}
              placeholder="Winner"
              name="winner"
              value={winner}
              onChange={this.handleInputChange}
            />

            <Button onClick={this.newPlayer}>New Player</Button>

            {players.map((player, i) => (
              <PlayerField
                key={i}
                users={users}
                player={player}
                onDelete={this.deletePlayer}
              />
            ))}

            <Message error header="Error" content={error && error.message} />
            <Message success header="Success" content="Successful operation" />
            <Button type="submit" onClick={this.onSubmit}>
              Submit
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }

  deletePlayer(player) {
    this.setState(prevState => ({
      players: prevState.players.filter(item => item !== player),
    }));
  }

  newPlayer() {
    const player = {
      user_id: 0,
      faction: '',
      hitler: false,
    };

    this.setState(prevState => ({players: [...prevState.players, player]}));
  }

  onSubmit() {
    const {action, after} = this.props;

    const game = {};

    action(game)
      .then(() =>
        this.setState({
          isLoading: false,
          success: true,
          error: null,
        }),
      )
      .then(after)
      .catch(error => this.setState({isLoading: false, error, success: false}));
  }
}
