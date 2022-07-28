import axios from 'axios';
import Cookie from 'js-cookie';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupButtonDropdown,
  Label,
} from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { errorNotification } from '../error-notification';
import { Notification } from '../notification';
import cardStyles from './ConnectionSearch.module.scss';
import './ConnectionSearch.scss';

const SearchField = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropDown = () => setDropdownOpen(!dropdownOpen);

  const { users } = props;
  return (
    <div>
      {/* Split input toggle, dropdown submit field */}
      <InputGroup>
        <Input type="select" name="target-user" id="users-dropdown" default="">
          {users && users.length > 0 ? (
            users.map((eachUser, i) => (
              <option key={i} value={eachUser.user_id}>
                {eachUser.username}
              </option>
            ))
          ) : (
            <p>No users to add</p>
          )}
        </Input>
        <InputGroupButtonDropdown addonType="append" isOpen={dropdownOpen} toggle={toggleDropDown}>
          <Button style={{ borderRadius: '0 100px 100px 0' }} color="primary">
            Send request
          </Button>
        </InputGroupButtonDropdown>
      </InputGroup>
    </div>
  );
};

class ConnectionSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      fetchSucceeded: false,
      users: [],
      dropdownOpen: false,
      splitButtonOpen: false,
    };
    this.sendConnectionRequest = this.sendConnectionRequest.bind(this);
    // this.removeConnection = this.removeConnection.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.toggleSplit = this.toggleSplit.bind(this);
  }

  componentWillMount() {
    this.setState({
      isLoading: true,
    });
    const currToken = Cookie.get('token');
    if (currToken) {
      axios
        .get(`${BASE_URL}/users/all?token=${currToken}`)
        .then((allUsers) => {
          this.setState({
            users: allUsers.data.users,
            isLoading: false,
            fetchSucceeded: true,
          });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: false,
          });
          errorNotification(err, "Couldn't fetch all users");
        });
    }
  }

  sendConnectionRequest(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const targetUserID = fd.get('target-user');
    const currToken = Cookie.get('token');
    const { refreshOutgoing } = this.props;
    if (currToken) {
      // alert(`Sending connection request: ${targetUserID} ${currToken}`);
      const postData = {
        method: 'post',
        url: `${BASE_URL}/connections/request`,
        data: {
          token: currToken,
          user_id: targetUserID,
        },
        headers: { 'Content-Type': 'application/json' },
      };
      axios(postData)
        .then((res) => {
          Notification.spawnNotification(
            'Connection request sent successfully',
            'Once they accept your request, you may start messaging them!',
            'success'
          );
          refreshOutgoing(currToken);
        })
        .catch((err) => {
          errorNotification(err, 'Connection request failed');
        });
    } else {
    }
  }

  toggleDropDown() {
    this.setStateg({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  toggleSplit() {
    this.setState({
      splitButtonOpen: !this.state.splitButtonOpen,
    });
  }

  render() {
    const { users } = this.state;
    return (
      <Card className={cardStyles.card}>
        <CardBody>
          <Form onSubmit={this.sendConnectionRequest} className="connection-search-form">
            <FormGroup>
              <Label for="users-dropdown">
                <h3 className={cardStyles.title}>Add a connection.</h3>
              </Label>
              <p style={{ color: 'grey', marginBottom: '30px' }}>
                Send a request to another developer you'd like to connect with. They'll become your contact when they
                accept and then you'll be able to direct message them.
              </p>
              <SearchField users={users} />
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export default ConnectionSearch;
