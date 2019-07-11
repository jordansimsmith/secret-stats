import React from 'react';
import {Segment, List, Container, Icon, Divider} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <Segment inverted vertical>
          <Container textAlign="center">
            <Icon name="user secret" inverted size="big" />

            <Divider />

            <List horizontal inverted divided link size="small">
              <List.Item as={Link} to="/">
                Home
              </List.Item>
              <List.Item
                as="a"
                href="https://github.com/jordansimsmith/are-you-hitler">
                GitHub
              </List.Item>
              <List.Item as="a" href="https://jordan.sim-smith.co.nz/contact">
                Contact
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}
