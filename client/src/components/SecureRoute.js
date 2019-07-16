import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import {Dimmer, Loader} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import auth from '../shared/auth';

export class SecureRoute extends React.Component {
  static propTypes = {
    component: PropTypes.element.isRequired,
    path: PropTypes.string.isRequired,
    checkingSession: PropTypes.bool.isRequired,
  };

  render() {
    const {component, path, checkingSession} = this.props;
    const Component = withRouter(component);

    return (
      <Route
        path={path}
        render={() => {
          // no action if the session is being checked
          if (checkingSession) {
            return (
              <Dimmer inverted active>
                <Loader>Checking Session</Loader>
              </Dimmer>
            );
          }

          // redirect to login or render component
          if (!auth.isAuthenticated()) {
            auth.signIn();
            return <div />;
          }
          return <Component />;
        }}
      />
    );
  }
}
