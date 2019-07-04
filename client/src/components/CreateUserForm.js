import React from 'react';
import {Button, Form, Modal, Message} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';

const API = 'http://localhost:3000';

export class CreateUserForm extends React.Component {
  static propTypes = {
    onCreate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      error: false,
      success: false,
      firstName: '',
      lastName: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.createUser = this.createUser.bind(this);
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
    const {isLoading, error, success, firstName, lastName} = this.state;

    return (
      <Modal trigger={<Button color="green">New User</Button>}>
        <Modal.Header>Create a New User</Modal.Header>
        <Modal.Content>
          <Form
            loading={isLoading}
            error={!!error}
            success={success}
            onSubmit={this.createUser}>
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
            <Message error header="Error" content={error && error.message} />
            <Message success header="Success" content="User created" />
            <Button type="submit">Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }

  createUser() {
    this.setState({isLoading: true});

    const {firstName, lastName} = this.state;

    const {onCreate} = this.props;

    const user = {
      first_name: firstName,
      last_name: lastName,
    };

    axios
      .post(`${API}/users`, user)
      .then(() =>
        this.setState({
          isLoading: false,
          success: true,
          error: null,
          firstName: '',
          lastName: '',
        }),
      )
      .then(onCreate)
      .catch(error => this.setState({isLoading: false, error, success: false}));
  }
}
