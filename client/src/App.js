import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Navigation} from './components/Navigation';
import {Footer} from './components/Footer';
import {Home} from './pages/home';
import {About} from './pages/about';
import {Games} from './pages/games';
import {Users} from './pages/users';
import {Stats} from './pages/stats';
import Callback from './pages/callback';
import {SecureRoute} from './components/SecureRoute';

export class App extends React.Component {
  render() {
    return (
      <Router>
        <Navigation />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/callback" component={Callback} />
          <Route path="/about" component={About} />
          <SecureRoute path="/games" component={Games} />
          <SecureRoute path="/users" component={Users} />
          <SecureRoute path="/stats" component={Stats} />
        </Switch>

        <Footer />
      </Router>
    );
  }
}
