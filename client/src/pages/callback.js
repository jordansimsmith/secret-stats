import React from 'react';
import {Dimmer, Loader} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import auth from '../shared/auth';

class Callback extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Dimmer inverted active>
        <Loader>Signing In</Loader>
      </Dimmer>
    );
  }

  async componentDidMount() {
    await auth.handleAuthentication();
    this.props.history.replace('/');
  }
}

export default withRouter(Callback);
