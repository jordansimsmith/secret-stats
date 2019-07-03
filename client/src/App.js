import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Home} from './pages/home';
import {Games} from './pages/games';
import {Users} from './pages/users';

export class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/games" component={Games} />
          <Route path="/users" component={Users} />
        </Switch>
      </Router>
    );
  }
}
