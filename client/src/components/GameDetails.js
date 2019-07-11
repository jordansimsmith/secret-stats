import React from 'react';
import {Header, Segment, Table, Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class GameDetails extends React.Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
  };

  render() {
    const {game, close} = this.props;

    const liberals = [];
    const fascists = [];
    const hitlers = [];

    game.players.forEach(player => {
      if (player.faction === 'liberal') {
        liberals.push(player);
      } else if (player.faction === 'fascist') {
        if (!player.hitler) {
          fascists.push(player);
        } else {
          hitlers.push(player);
        }
      }
    });

    return (
      <Segment>
        <Header>At {new Date(game.timestamp).toLocaleString()}</Header>
        <p>
          The {game.winner}’s secured a stunning victory in a{' '}
          {game.number_of_players} player game.
        </p>

        <Table celled padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Liberals</Table.HeaderCell>
              <Table.HeaderCell>Fascists</Table.HeaderCell>
              <Table.HeaderCell>Hitler</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.renderRows(liberals, fascists, hitlers)}
          </Table.Body>
        </Table>

        <Button onClick={close}>Close</Button>
      </Segment>
    );
  }

  renderRows(liberals, fascists, hitlers) {
    const maxLength = Math.max(
      liberals.length,
      fascists.length,
      hitlers.length,
    );
    const rows = [];

    for (let i = 0; i < maxLength; i++) {
      const liberal = liberals.pop();
      const fascist = fascists.pop();
      const hitler = hitlers.pop();
      const row = (
        <Table.Row key={i}>
          <Table.Cell>{liberal && liberal.user_id}</Table.Cell>
          <Table.Cell>{fascist && fascist.user_id}</Table.Cell>
          <Table.Cell>{hitler && hitler.user_id}</Table.Cell>
        </Table.Row>
      );

      rows.push(row);
    }

    return rows;
  }
}
