import React from 'react';
import {Container, Header, Icon, Divider, Segment} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export class About extends React.Component {
  render() {
    return (
      <div className="content-wrap">
        <Container>
          <Header as="h1" icon textAlign="center">
            <Icon name="question circle" />
            <Header.Content>About</Header.Content>
          </Header>

          <Divider />

          <Segment>
            <Header as="h2">What is Secret Hitler?</Header>
            <p>
              Secret Hitler is a social deduction game for 5-10 people about
              finding and stopping the Secret Hitler.
            </p>

            <p>
              Players are secretly divided into two teams: the liberals, who
              have a majority, and the fascists, who are hidden to everyone but
              each other. If the liberals can learn to trust each other, they
              have enough votes to control the elections and save the day. But
              the fascists will say whatever it takes to get elected, advance
              their agenda, and win the game.
            </p>

            <a href="https://www.secrethitler.com">
              from the Secret Hitler website.
            </a>
          </Segment>

          <Segment>
            <Header as="h2">What is this webiste for?</Header>
            <p>
              This website—Are You Hitler?—is a tool for recording outcomes of
              Secret Hitler games between friends. Records of past games can be
              inspected on a per-user basis. Most importantly, various
              statistics concerning each user’s performance in different roles
              are calculated.
            </p>

            <p>
              Get started with Are You Hitler? by
              <Link to="/users"> registering a group of users</Link> and
              <Link to="/games"> recording your first game.</Link>
            </p>
          </Segment>
        </Container>
      </div>
    );
  }
}
