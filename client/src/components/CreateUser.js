import React from 'react';
import {Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {UserForm} from './UserForm';
import API from '../shared/apiAdapter';

export class CreateUser extends React.Component {
  static propTypes = {
    onCreate: PropTypes.func.isRequired,
  };

  render() {
    const {onCreate} = this.props;
    const button = <Button color="green">New User</Button>;

    const action = API.createUser;

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
