import React from 'react';
import {
  Container,
  Header,
  Icon,
  Message,
  Divider,
  Form,
  Select,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import {StatsTable} from '../components/StatsTable';
import API from '../shared/apiAdapter';

export class Stats extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    // extract user_id from query
    const userID = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).user_id;

    this.state = {
      userID: parseInt(userID, 10),
      users: [],
      isLoading: false,
    };
  }

  render() {
    const {user, userID, users, stats, error, isLoading} = this.state;
    const userOptions = users.map(user => ({
      text: `${user.first_name} ${user.last_name}`,
      value: user.user_id,
    }));

    return (
      <div className="content-wrap">
        <Container>
          <Header as="h1" icon textAlign="center">
            <Icon name="line graph" />
            <Header.Content>
              {user
                ? `${user.first_name} ${user.last_name}'s Statistics`
                : 'Statistics'}
            </Header.Content>
          </Header>

          <Form>
            <Form.Input
              placeholder="Choose a user to display statistics for"
              control={Select}
              options={userOptions}
              name="userID"
              value={userID || ''}
              onChange={this.onChange}
            />
          </Form>

          <Divider />

          <Dimmer inverted active={isLoading}>
            <Loader>Loading Statistics</Loader>
          </Dimmer>

          <Message hidden={!error} color="red">
            <Message.Header>
              An error was encountered when fetching user statistics data
            </Message.Header>
            <p>{error && error.message}</p>
            {error && error.response && (
              <p> Message: {error.response.data.message}</p>
            )}
          </Message>

          {stats ? <StatsTable stats={stats} /> : null}
        </Container>
      </div>
    );
  }

  onChange = (e, data) => {
    const userID = data.value;

    // update the state
    this.setState({
      [data.name]: userID,
    });

    // change query
    this.props.history.push(`/stats?user_id=${userID}`);

    // reload statistics and user
    this.getUser(userID);
    this.getStats(userID);
  };

  componentDidMount() {
    const {userID} = this.state;
    this.getUsers();
    userID && this.getUser(userID);
    userID && this.getStats(userID);
  }

  getUser(userID) {
    API.getUser(userID)
      .then(res => this.setState({user: res.data}))
      .catch(error => this.setState({error}));
  }

  getUsers() {
    API.getUsers()
      .then(res => this.setState({users: res.data}))
      .catch(error => this.setState({error}));
  }

  getStats(userID) {
    this.setState({isLoading: true});
    API.getStats(userID)
      .then(res => this.setState({stats: res.data, isLoading: false}))
      .catch(error => this.setState({error, isLoading: false}));
  }
}
