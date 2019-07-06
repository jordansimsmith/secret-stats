import React from 'react';
import {Form, Select} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class PlayerField extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    users: PropTypes.array.isRequired,
    player: PropTypes.object.isRequired,
    removePlayer: PropTypes.func.isRequired,
    updatePlayer: PropTypes.func.isRequired,
  };

  render() {
    const {users, player, index, removePlayer, updatePlayer} = this.props;
    const options = users.map(user => ({
      text: `${user.first_name} ${user.last_name}`,
      value: user.user_id,
    }));

    const factions = [
      {text: 'Liberal', value: 'liberal'},
      {text: 'Fascist', value: 'fascist'},
    ];

    const hitlerOptions = [
      {text: 'Not Hitler', value: false},
      {text: 'Hitler', value: true},
    ];

    return (
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label="User"
          placeholder="User"
          control={Select}
          options={options}
          name="user_id"
          value={player.user_id || ''}
          onChange={updatePlayer(index)}
        />
        <Form.Input
          fluid
          label="Role"
          placeholder="Role"
          control={Select}
          options={factions}
          name="faction"
          value={player.faction}
          onChange={updatePlayer(index)}
        />
        <Form.Input
          fluid
          label="Hitler"
          placeholder="Hitler"
          control={Select}
          options={hitlerOptions}
          name="hitler"
          value={player.hitler}
          onChange={updatePlayer(index)}
        />
        <Form.Button onClick={removePlayer(index)}>Remove</Form.Button>
      </Form.Group>
    );
  }
}
