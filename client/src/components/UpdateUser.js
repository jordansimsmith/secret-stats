import React from 'react';
import {Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {UserForm} from './UserForm';
import API from '../shared/apiAdapter';

export class UpdateUser extends React.Component {
  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  render() {
    const {onUpdate} = this.props;
    const button = <Button color="orange">Edit</Button>;
    const {user} = this.props;
    const id = user.user_id;

    const action = userID => user => API.updateUser(user, userID);

    return (
      <UserForm
        trigger={button}
        header="Edit User Information"
        action={action(id)}
        after={onUpdate}
        user={user}
      />
    );
  }
}
