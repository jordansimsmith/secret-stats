import React from 'react';
import {Container, Header, Button, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export class Home extends React.Component {
  render() {
    return (
      <div className="content-wrap" id="landing-background">
        <Container>
          <Header as="h1" icon textAlign="center">
            <Icon name="user secret" />
            <Header.Content>Secret Stats</Header.Content>
          </Header>
          <div className="center" id="landing-button">
            <Button as={Link} to="/about" size="huge" color="blue">
              Get Started
              <Icon name="right arrow" />
            </Button>
          </div>
        </Container>
      </div>
    );
  }
}
