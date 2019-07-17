import React from 'react';
import {Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {GameForm} from './GameForm';
import API from '../shared/apiAdapter';

export class UpdateGame extends React.Component {
  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
    game: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
  };

  render() {
    const {onUpdate, game, users} = this.props;
    const button = <Button color="orange">Edit</Button>;
    const id = game.game_id;

    const action = gameID => game => API.updateGame(game, gameID);

    return (
      <GameForm
        trigger={button}
        header="Edit Game Information"
        action={action(id)}
        after={onUpdate}
        users={users}
        game={game}
      />
    );
  }
}
