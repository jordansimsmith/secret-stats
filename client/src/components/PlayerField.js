import React from 'react';
import {Form, Select} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class PlayerField extends React.Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  render() {
    const {users} = this.props;
    const options = users.map(user => ({
      text: `${user.first_name} ${user.last_name}`,
      value: user.user_id,
    }));

    const factions = [
      {text: 'Liberal', value: 'liberal'},
      {text: 'Fascist', value: 'fascist'},
    ];

    return (
      <Form.Group inline>
        <Form.Input
          label="User"
          placeholder="User"
          control={Select}
          options={options}
          width={6}
        />
        <Form.Input
          label="Role"
          placeholder="Role"
          control={Select}
          options={factions}
          width={6}
        />
        <Form.Checkbox label="Player is Hitler" />
      </Form.Group>
    );
  }
}
