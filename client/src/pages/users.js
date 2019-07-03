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

const API = 'http://localhost:3000';

export class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
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

        <Card.Group centered>
          {users.map(user => (
            <Card key={user.user_id}>
              <Card.Content>
                <Card.Header>
                  {user.first_name} {user.last_name}
                </Card.Header>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </Container>
    );
  }

  componentDidMount() {
    axios
      .get(`${API}/users`)
      .then(res => this.setState({users: res.data}))
      .catch(error => this.setState({error}));
  }
}
