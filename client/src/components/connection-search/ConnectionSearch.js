import axios from 'axios';
import Cookie from 'js-cookie';
import React, { useState } from 'react';
import { 
    Card, 
    CardBody, 
    Form, 
    FormGroup, 
    Input, 
    Label, 
    InputGroupButtonDropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem, 
    InputGroup,
    Button
} from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { Notification } from '../notification';
import './ConnectionSearch.scss';
import cardStyles from './ConnectionSearch.module.scss';

const SearchField = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [splitButtonOpen, setSplitButtonOpen] = useState(false);

    const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
    const toggleSplit = () => setSplitButtonOpen(!splitButtonOpen);

    const { users } = props;
    return (
        <div>
            {/* Split input toggle, dropdown submit field */}
            <InputGroup>
                <Input type="select" name="target-user" id="users-dropdown" default="">
                    {(users && users.length > 0) ? (
                        users.map((eachUser, i) => (
                            <option key={i} value={eachUser.user_id}>{eachUser.username}</option>
                            ))
                            ) : (
                                <p>No users to add</p>
                            )
                    }
                </Input>                
                <InputGroupButtonDropdown addonType="append" isOpen={dropdownOpen} toggle={toggleDropDown}>
                    <Button>
                        Send request
                    </Button>
                </InputGroupButtonDropdown>
            </InputGroup>
        </div>
    );
}

function removeConnection(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const targetUserID = fd.get("target-user");
    const currToken = Cookie.get("token");
    const { refreshConnections } = this.props;
    if (currToken) {
        const postData = {
            method: 'post',
            url: `${BASE_URL}/connections/remove`,
            data: {
                token: currToken,
                user_id: targetUserID
            },
            headers: { "Content-Type": "application/json" }
        };
        axios(postData)
            .then((res) => {
                Notification.spawnNotification("Success", "You have removed a connection", "success");
                refreshConnections(currToken);
                this.toggleModal(false);
            })
            .catch((err) => {
                if (err.data) {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Failed to remove connection", errorMessage, "danger");
                } else {
                    Notification.spawnNotification("Failed to remove connection", "Techsuite messed up something. Sorry!", "danger");
                }
            });
    }
}

class ConnectionSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            users: [],
            dropdownOpen: false,
            splitButtonOpen: false
        };
        this.sendConnectionRequest = this.sendConnectionRequest.bind(this);
        // this.removeConnection = this.removeConnection.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleSplit = this.toggleSplit.bind(this);
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
        event.preventDefault();
        const fd = new FormData(event.target);
        const targetUserID = fd.get("target-user");
        const currToken = Cookie.get("token");
        const { refreshOutgoing } = this.props;
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
                    refreshOutgoing(currToken);
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Connection request failed", errorMessage, "danger");
                });
        } else {
    
        }
    }

    toggleDropDown() {
        this.setStateg({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleSplit() {
        this.setState({
            splitButtonOpen: !this.state.splitButtonOpen
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
                                <h3 className={cardStyles.title}>Manage Connections</h3>
                            </Label>
                            <SearchField users={users} />
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        );
    }
}

export default ConnectionSearch;
