import React from 'react';
import {
  Container,
  Header,
  Icon,
  Message,
  Card,
  Divider,
  Button,
} from 'semantic-ui-react';
import axios from 'axios';
import {CreateUserForm} from '../components/CreateUserForm';

const API = 'http://localhost:3000';

export class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };

    this.getUsers = this.getUsers.bind(this);
  }

  render() {
    const {users, error} = this.state;

    // check for error when fetching user data
    if (error) {
      return (
        <Message color="red">
          <Message.Header>
            An error was encountered when fetching user data.
          </Message.Header>
          <p>{error.message}</p>
        </Message>
      );
    }

    // success
    return (
      <Container>
        <Header as="h1" icon textAlign="center">
          <Icon name="user" />
          <Header.Content>Users</Header.Content>
        </Header>

        <Divider />

        <CreateUserForm onCreate={this.getUsers} />

        <Divider />

        <Card.Group>
          {users.map(user => (
            <Card key={user.user_id}>
              <Card.Content>
                <Card.Header>
                  {user.first_name} {user.last_name}
                </Card.Header>
                <Button basic color="blue">
                  Games
                </Button>
                <Button basic color="orange">
                  Edit
                </Button>
                <Button basic color="red">
                  Delete
                </Button>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </Container>
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
