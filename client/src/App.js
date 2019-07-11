import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Navigation} from './components/Navigation';
import {Footer} from './components/Footer';
import {Home} from './pages/home';
import {About} from './pages/about';
import {Games} from './pages/games';
import {Users} from './pages/users';
import {Stats} from './pages/stats';

export class App extends React.Component {
  render() {
    return (
      <Router>
        <Navigation />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/games" component={Games} />
          <Route path="/users" component={Users} />
          <Route path="/stats" component={Stats} />
        </Switch>

        <Footer />
      </Router>
    );
  }
}
