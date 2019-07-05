import React from 'react';
import {Button, Form, Modal, Message} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class GameForm extends React.Component {
  static propTypes = {
    trigger: PropTypes.node.isRequired,
    header: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
    after: PropTypes.func,
    game: PropTypes.object,
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
    const {trigger, header} = this.props;
    const {isLoading, error, success, timestamp, winner, players} = this.state;

    return (
      <Modal trigger={trigger}>
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>
          <Form
            loading={isLoading}
            error={!!error}
            success={success}
            onSubmit={this.onSubmit}>
            <Form.Field>
              <label>Time Stamp</label>
              <input
                placeholder="Time Stamp"
                name="timestamp"
                value={timestamp || ''}
                onChange={this.handleInputChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Winner</label>
              <input
                placeholder="Winner"
                name="winner"
                value={winner}
                onChange={this.handleInputChange}
              />
            </Form.Field>
            <Message error header="Error" content={error && error.message} />
            <Message success header="Success" content="Successful operation" />
            <Button type="submit">Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }

  onSubmit() {
    const {action, after} = this.props;

    action()
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
