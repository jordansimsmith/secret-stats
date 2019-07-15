import React from 'react';
import {Button} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import auth from '../shared/auth';

class Login extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  signOut = () => {
    auth.signOut();
    this.props.history.replace('/');
  };

  render() {
    return (
      <div>
        {auth.isAuthenticated() ? (
          <Button onClick={this.signOut}>Sign Out</Button>
        ) : (
          <Button color="blue" onClick={auth.signIn}>
            Sign In
          </Button>
        )}
      </div>
    );
  }
}

export default withRouter(Login);
