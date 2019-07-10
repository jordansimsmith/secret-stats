import React from 'react';
import {Container, Header, Button} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export class Home extends React.Component {
  render() {
    return (
      <Container>
        <Header as="h1" textAlign="center">
          <Header.Content>Are You Hitler?</Header.Content>
        </Header>

        <Button as={Link} to="/about">
          Get Started
        </Button>
      </Container>
    );
  }
}
