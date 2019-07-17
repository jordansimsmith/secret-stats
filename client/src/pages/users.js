import React from 'react';
import {
  Container,
  Header,
  Icon,
  Message,
  Card,
  Divider,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {CreateUser} from '../components/CreateUser';
import {UserCard} from '../components/UserCard';
import API from '../shared/apiAdapter';

export class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      error: null,
      isLoading: false,
    };

    this.getUsers = this.getUsers.bind(this);
  }

  render() {
    const {users, error, isLoading} = this.state;

    return (
      <div className="content-wrap">
        <Container>
          <Header as="h1" icon textAlign="center">
            <Icon name="user" />
            <Header.Content>Users</Header.Content>
          </Header>

          <Divider />

          <div className="center">
            <CreateUser onCreate={this.getUsers} />
          </div>

          <Divider />

          <Dimmer inverted active={isLoading}>
            <Loader>Loading Users</Loader>
          </Dimmer>

          <Message hidden={!error} color="red">
            <Message.Header>
              An error was encountered when fetching user data
            </Message.Header>
            <p>{error && error.message}</p>
            {error && error.response && (
              <p> Message: {error.response.data.message}</p>
            )}
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
    this.setState({isLoading: true});
    this.getUsers();
  }

  getUsers() {
    API.getUsers()
      .then(res => this.setState({users: res.data, isLoading: false}))
      .catch(error => this.setState({error, isLoading: false}));
  }
}
