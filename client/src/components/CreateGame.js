import React from 'react';
import {Button} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {GameForm} from './GameForm';
import {API} from '../shared/api';

export class CreateGame extends React.Component {
  static propTypes = {
    onCreate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  render() {
    const {onCreate} = this.props;
    const {users} = this.state;
    const button = <Button color="green">New Game</Button>;
    const action = game => axios.post(`${API}/games`, game);

    return (
      <GameForm
        trigger={button}
        header="Create a New Game"
        action={action}
        after={onCreate}
        users={users}
      />
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
