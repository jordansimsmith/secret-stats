import React from 'react';
import {Form, Select, Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class PlayerField extends React.Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    player: PropTypes.object,
    onDelete: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  render() {
    const {users, onDelete, player} = this.props;
    const options = users.map(user => ({
      text: `${user.first_name} ${user.last_name}`,
      value: user.user_id,
    }));

    const factions = [
      {text: 'Liberal', value: 'liberal'},
      {text: 'Fascist', value: 'fascist'},
    ];

    const onClick = () => onDelete(player);

    return (
      <Form.Group inline widths="equal">
        <Form.Input
          fluid
          label="User"
          placeholder="User"
          control={Select}
          options={options}
        />
        <Form.Input
          fluid
          label="Role"
          placeholder="Role"
          control={Select}
          options={factions}
        />
        <Form.Checkbox label="Player is Hitler" />
        <Button onClick={onClick}>Remove</Button>
      </Form.Group>
    );
  }
}
