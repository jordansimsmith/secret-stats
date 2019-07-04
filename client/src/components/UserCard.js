import React from 'react';
import {Card, Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const API = 'http://localhost:3000';

export class UserCard extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {user} = this.props;

    return (
      <Card>
        <Card.Content>
          <Card.Header>
            {user.first_name} {user.last_name}
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          <Button color="blue">Games</Button>
          <Button color="orange">Edit</Button>
          <Button color="red">Delete</Button>
        </Card.Content>
      </Card>
    );
  }
}
