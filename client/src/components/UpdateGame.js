import React from 'react';
import {Button} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {GameForm} from './GameForm';
import {API} from '../shared/api';

export class UpdateGame extends React.Component {
  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
    game: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  render() {
    const {onUpdate, game} = this.props;
    const {users} = this.state;
    const button = <Button color="orange">Edit</Button>;
    const id = game.game_id;

    const action = game => axios.put(`${API}/games/${id}`, game);

    return (
      <GameForm
        trigger={button}
        header="Edit Game Information"
        action={action}
        after={onUpdate}
        users={users}
        game={game}
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
