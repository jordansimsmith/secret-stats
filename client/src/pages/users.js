import React from 'react';
import {
  Container,
  Header,
  Icon,
  Message,
  Card,
  Divider,
} from 'semantic-ui-react';
import axios from 'axios';
import {CreateUser} from '../components/CreateUser';
import {UserCard} from '../components/UserCard';

const API = 'http://localhost:3000';

export class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      error: null,
    };

    this.getUsers = this.getUsers.bind(this);
  }

  render() {
    const {users, error} = this.state;

    return (
      <div className="content-wrap">
        <Container>
          <Header as="h1" icon textAlign="center">
            <Icon name="user" />
            <Header.Content>Users</Header.Content>
          </Header>

          <Divider />

          <CreateUser onCreate={this.getUsers} />

          <Divider />

          <Message hidden={!error} color="red">
            <Message.Header>
              An error was encountered when fetching user data
            </Message.Header>
            <p>{error && error.message}</p>
          </Message>

          <Card.Group stackable itemsPerRow={2}>
            {users.map(user => (
              <UserCard
                key={user.user_id}
                user={user}
                onAction={this.getUsers}
              />
            ))}
          </Card.Group>
        </Container>
      </div>
    );
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    axios
      .get(`${API}/users`)
      .then(res => this.setState({users: res.data}))
      .catch(error => this.setState({error}));
  }
}
