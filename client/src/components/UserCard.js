import React from 'react';
import {Card, Button, Confirm} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {UpdateUser} from './UpdateUser';

const API = 'http://localhost:3000';

export class UserCard extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    onAction: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmOpen: false,
    };

    this.deleteUser = this.deleteUser.bind(this);
  }

  render() {
    const {user, onAction} = this.props;
    const {confirmOpen} = this.state;

    return (
      <Card>
        <Card.Content>
          <Card.Header>
            {user.first_name} {user.last_name}
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          <Link to={`games?user_id=${user.user_id}`}>
            <Button color="blue">Games</Button>
          </Link>
          <UpdateUser user={user} onUpdate={onAction} />
          <Button color="red" onClick={this.open}>
            Delete
          </Button>
          <Confirm
            open={confirmOpen}
            onCancel={this.close}
            onConfirm={this.deleteUser}
          />
        </Card.Content>
      </Card>
    );
  }

  open = () => this.setState({confirmOpen: true});
  close = () => this.setState({confirmOpen: false});

  deleteUser() {
    const id = this.props.user.user_id;
    const {onAction} = this.props;

    axios
      .delete(`${API}/users/${id}`)
      .then(onAction)
      .then(this.close)
      .catch(() => this.setState({isLoading: false, error: true}));
  }
}
