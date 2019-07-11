import React from 'react';
import {Container, Header, Button, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export class Home extends React.Component {
  render() {
    return (
      <Container>
        <Header as="h1" icon textAlign="center">
          <Icon name="user secret" />
          <Header.Content>Are You Hitler?</Header.Content>
          <Button as={Link} to="/about">
            Get Started
          </Button>
        </Header>
      </Container>
    );
  }
}
