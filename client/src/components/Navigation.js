import React from 'react';
import {Menu, Container, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import Login from './Login';

export class Navigation extends React.Component {
  render() {
    return (
      <Menu stackable inverted>
        <Container>
          <Menu.Item as={Link} to="/" header>
            <Icon name="user secret" inverted size="big" />
            Secret Stats
          </Menu.Item>
          <Menu.Item as={Link} to="/about">
            About
          </Menu.Item>
          <Menu.Item as={Link} to="/games">
            Games
          </Menu.Item>
          <Menu.Item as={Link} to="/users">
            Users
          </Menu.Item>
          <Menu.Item as={Link} to="/stats">
            Statistics
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Login />
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}
