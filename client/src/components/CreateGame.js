import React from 'react';
import {Button} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {GameForm} from './GameForm';

const API = 'http://localhost:3000';

export class CreateGame extends React.Component {
  static propTypes = {
    onCreate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {onCreate} = this.props;
    const button = <Button color="green">New Game</Button>;

    const action = game => axios.post(`${API}/games`, game);

    return (
      <GameForm
        trigger={button}
        header="Create a New Game"
        action={action}
        after={onCreate}
      />
    );
  }
}
