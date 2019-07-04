import React from 'react';
import {Button, Form, Modal, Message} from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';

const API = 'http://localhost:3000';

export class UpdateUserForm extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      error: false,
      success: false,
      firstName: props.user.first_name,
      lastName: props.user.last_name,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateUser = this.updateUser.bind(this);
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
      <Modal trigger={<Button color="orange">Edit</Button>}>
        <Modal.Header>Update a User</Modal.Header>
        <Modal.Content>
          <Form
            loading={isLoading}
            error={!!error}
            success={success}
            onSubmit={this.updateUser}>
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
            <Message success header="Success" content="User updated" />
            <Button type="submit">Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }

  updateUser() {
    this.setState({isLoading: true});

    const id = this.props.user.user_id;
    const {firstName, lastName} = this.state;

    const {onUpdate} = this.props;

    const user = {
      first_name: firstName,
      last_name: lastName,
    };

    axios
      .put(`${API}/users/${id}`, user)
      .then(() => this.setState({isLoading: false, success: true, error: null}))
      .then(onUpdate)
      .catch(error => this.setState({isLoading: false, error, success: false}));
  }
}
