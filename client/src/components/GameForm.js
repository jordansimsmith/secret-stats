import React from 'react';
import {Button, Form, Modal, Message, Select, Divider} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {PlayerField} from './PlayerField';

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
    const players = game ? game.players : [];

    this.state = {
      isLoading: false,
      error: null,
      success: false,
      timestamp,
      winner,
      players,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e, data) {
    this.setState({
      [data.name]: data.value,
    });
  }

  render() {
    const {trigger, header, users} = this.props;
    const {isLoading, error, success, timestamp, players} = this.state;

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
              onChange={this.handleInputChange}
            />
            <Button onClick={this.handleAddPlayer}>New Player</Button>
            <Divider />
            {players.map((player, i) => (
              <PlayerField
                key={i}
                index={i}
                users={users}
                player={player}
                removePlayer={this.handleRemovePlayer}
                updatePlayer={this.handleUpdatePlayer}
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

  handleRemovePlayer = index => () => {
    this.setState({players: this.state.players.filter((p, i) => i !== index)});
  };

  handleAddPlayer = () => {
    this.setState({
      players: [
        ...this.state.players,
        {user_id: 0, faction: '', hitler: false},
      ],
    });
  };

  handleUpdatePlayer = index => (e, data) => {
    const players = this.state.players.map((player, i) =>
      i !== index ? player : {...player, [data.name]: data.value},
    );
    this.setState({players});
  };

  onSubmit() {
    const {action, after} = this.props;
    const {timestamp, winner, players} = this.state;

    const game = {
      timestamp,
      winner,
      number_of_players: players.length,
      players,
    };

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
