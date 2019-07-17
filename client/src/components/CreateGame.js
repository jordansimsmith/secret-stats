import React from 'react';
import {Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {GameForm} from './GameForm';
import API from '../shared/apiAdapter';

export class CreateGame extends React.Component {
  static propTypes = {
    onCreate: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
  };

  render() {
    const {onCreate, users} = this.props;
    const button = <Button color="green">New Game</Button>;
    const action = API.createGame;

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
}
