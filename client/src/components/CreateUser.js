import React from 'react';
import {Button} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {UserForm} from './UserForm';

const API = 'http://localhost:3000';

export class CreateUser extends React.Component {
  static propTypes = {
    onCreate: PropTypes.func.isRequired,
  };

  render() {
    const {onCreate} = this.props;
    const button = <Button color="green">New User</Button>;

    const action = user => axios.post(`${API}/users`, user);

    return (
      <UserForm
        trigger={button}
        header="Create a New User"
        action={action}
        after={onCreate}
      />
    );
  }
}
