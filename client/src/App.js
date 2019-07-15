import React from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Navigation} from './components/Navigation';
import {Footer} from './components/Footer';
import {Home} from './pages/home';
import {About} from './pages/about';
import {Games} from './pages/games';
import {Users} from './pages/users';
import {Stats} from './pages/stats';
import Callback from './pages/callback';
import {SecureRoute} from './components/SecureRoute';
import auth from './shared/auth';

class App extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      checkingSession: true,
    };
  }

  render() {
    const {checkingSession} = this.state;
    return (
      <div>
        <Navigation />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/callback" component={Callback} />
          <Route path="/about" component={About} />
          <SecureRoute
            checkingSession={checkingSession}
            path="/games"
            component={Games}
          />
          <SecureRoute
            checkingSession={checkingSession}
            path="/users"
            component={Users}
          />
          <SecureRoute
            checkingSession={checkingSession}
            path="/stats"
            component={Stats}
          />
        </Switch>

        <Footer />
      </div>
    );
  }

  async componentDidMount() {
    if (this.props.location.pathname === '/callback') {
      this.setState({checkingSession: false});
      return;
    }
    try {
      await auth.silentAuth();
      this.forceUpdate();
    } catch (error) {
      this.setState({error});
    }
    this.setState({checkingSession: false});
  }
}

export default withRouter(App);
