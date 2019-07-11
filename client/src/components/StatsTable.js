import React from 'react';
import {Header, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class StatsTable extends React.Component {
  static propTypes = {
    stats: PropTypes.object.isRequired,
  };

  render() {
    const {stats} = this.props;

    return (
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Games Played</Table.HeaderCell>
            <Table.HeaderCell>Games Won</Table.HeaderCell>
            <Table.HeaderCell>Games Lost</Table.HeaderCell>
            <Table.HeaderCell>Win Rate</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.row('All Games', stats.all_games)}
          {this.row('Liberal Games', stats.liberal_games)}
          {this.row(
            'Fascist (Non Hitler) Games',
            stats.fascist_non_hitler_games,
          )}
          {this.row('Hitler Games', stats.fascist_hitler_games)}
        </Table.Body>
      </Table>
    );
  }

  row(header, s) {
    return (
      <Table.Row>
        <Table.Cell>
          <Header textAlign="center">{header}</Header>
        </Table.Cell>
        <Table.Cell>{s.games_played}</Table.Cell>
        <Table.Cell>{s.games_won}</Table.Cell>
        <Table.Cell>{s.games_lost}</Table.Cell>
        <Table.Cell>{Math.floor(s.win_rate * 100)}%</Table.Cell>
      </Table.Row>
    );
  }
}
