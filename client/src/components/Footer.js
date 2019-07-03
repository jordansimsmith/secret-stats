import React from 'react';
import {Link} from 'react-router-dom';
import {Segment, List, Container} from 'semantic-ui-react';

export class Footer extends React.Component {
  render() {
    return (
      <Segment inverted vertical>
        <Container textAlign="center">
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
    );
  }
}
