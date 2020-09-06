import React from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Cookie from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';
import './ConnectionSearch.scss';
import { Notification } from '../notification';

class ConnectionSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            users: []
        };
        this.sendConnectionRequest = this.sendConnectionRequest.bind(this);
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        });
        const currToken = Cookie.get("token");
        if (currToken) {
            axios.get(`${BASE_URL}/users/all?token=${currToken}`)
                .then((allUsers) => {
                    this.setState({
                        users: allUsers.data.users,
                        isLoading: false,
                        fetchSucceeded: true
                    });
                })
                .catch((err) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    });
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Couldn't fetch all users", errorMessage, "danger");
                });
        }
    }

    sendConnectionRequest(event) {
        const { refresh } = this.props;
        event.preventDefault();
        const fd = new FormData(event.target);
        const targetUserID = fd.get("target-user");
        const currToken = Cookie.get("token");
        if (currToken) {
            // alert(`Sending connection request: ${targetUserID} ${currToken}`);
            const postData = {
                method: 'post',
                url: `${BASE_URL}/connections/request`,
                data: {
                    token: currToken,
                    user_id: targetUserID
                },
                headers: { "Content-Type": "application/json" }
            }
            axios(postData)
                .then((res) => {
                    Notification.spawnNotification("Connection request sent successfully", "Once they accept your request, you may start messaging them!", "success");
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Connection request failed", errorMessage, "danger");
                });
        } else {

        }
    }

    render() {
        const { users } = this.state;
        return (
            <Form onSubmit={this.sendConnectionRequest} className="connection-search-form">
                <FormGroup>
                    <Label for="users-dropdown">Select Multiple</Label>
                    <Input type="select" name="target-user" id="users-dropdown">
                        {(users && users.length > 0) ? (
                            users.map((eachUser, i) => (
                                <option key={i} value={eachUser.user_id}>{eachUser.username}</option>
                            ))
                        ) : (
                            <p>No users to add</p>
                        )}
                    </Input>
                </FormGroup>
                <Button>Add Connection</Button>
            </Form>
        );
    }
}

export default ConnectionSearch;
