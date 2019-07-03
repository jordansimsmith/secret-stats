import React from 'react';
import {Menu, Container} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export class Navigation extends React.Component {
  render() {
    return (
      <Menu inverted>
        <Container>
          <Menu.Item as={Link} to="/" header>
            Are You Hitler?
          </Menu.Item>
          <Menu.Item as={Link} to="/games">
            Games
          </Menu.Item>
          <Menu.Item as={Link} to="/users">
            Users
          </Menu.Item>
        </Container>
      </Menu>
    );
  }
}