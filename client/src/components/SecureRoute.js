import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import auth from '../shared/auth';

export class SecureRoute extends React.Component {
  static propTypes = {
    component: PropTypes.element.isRequired,
    path: PropTypes.string.isRequired,
  };

  render() {
    const {component, path} = this.props;
    const Component = withRouter(component);

    return (
      <Route
        path={path}
        render={() => {
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
