import React from 'react';
import {Button, Form, Modal, Message} from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class UserForm extends React.Component {
  static propTypes = {
    trigger: PropTypes.node.isRequired,
    header: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
    after: PropTypes.func,
    user: PropTypes.object,
  };

  constructor(props) {
    super(props);

    // get user information or set defaults
    const {user} = this.props;
    const firstName = user ? user.first_name : '';
    const lastName = user ? user.last_name : '';

    this.state = {
      isLoading: false,
      error: null,
      success: false,
      firstName: firstName,
      lastName: lastName,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  render() {
    const {trigger, header} = this.props;
    const {isLoading, error, success, firstName, lastName} = this.state;

    return (
      <Modal trigger={trigger}>
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>
          <Form
            loading={isLoading}
            error={!!error}
            success={success}
            onSubmit={this.onSubmit}>
            <Form.Field>
              <label>First Name</label>
              <input
                placeholder="First Name"
                name="firstName"
                value={firstName}
                onChange={this.handleInputChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <input
                placeholder="Last Name"
                name="lastName"
                value={lastName}
                onChange={this.handleInputChange}
              />
            </Form.Field>
            <Message error>
              <Message.Header>Error</Message.Header>
              <p>{error && error.message}</p>
              {error && error.response && (
                <p> Message: {error.response.data.message}</p>
              )}
            </Message>
            <Message success header="Success" content="User created" />
            <Button type="submit">Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }

  onSubmit() {
    const {action, after} = this.props;
    const {firstName, lastName} = this.state;
    const user = {
      first_name: firstName,
      last_name: lastName,
    };

    action(user)
      .then(() => this.setState({isLoading: false, success: true, error: null}))
      .then(after)
      .catch(error => this.setState({isLoading: false, error, success: false}));
  }
}
