import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { BASE_URL } from '../../constants/api-routes';
import { Row, Col, Card, CardHeader, CardBody, Container, Button, Form, Input } from 'reactstrap';
import { ChannelMessages } from '../../components/channel-messages';
import { UserInvite } from '../../components/user-invite';
import { ChannelLeave } from '../../components/channel-leave';
import { ChannelEdit } from '../../components/channel-edit';
import { ChannelUploadImage } from '../../components/channel-upload-image';
import { ChannelDetails } from '../../components/channel-details';
import { ChannelUploadCover } from '../../components/channel-upload-cover';
import { ChannelSearchMessages } from '../../components/channel-search-messages';
import { Notification } from '../../components/notification';
import { UserAddOwner } from '../../components/user-add-owner';
import { UserRemoveOwner } from '../../components/user-remove-owner';
import { LoadingSpinner } from '../../components/loading-spinner';
import { ConnectionSearch } from '../../components/connection-search';
import { ConnectionsList } from '../../components/connections-list';


class Connections extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            users: {},
            incomingUsers: {},
            outgoingUsers: {}
        };
        this.fetchConnections = this.fetchConnections.bind(this);
        this.fetchConnectionsIncoming = this.fetchConnectionsIncoming.bind(this);
        this.fetchConnectionsOutgoing = this.fetchConnectionsOutgoing.bind(this);
    }

    componentWillMount() {
        // TODO: Async refactor so that this.setState({ isloading, fetchsucceeded, ...}) works
        const currToken = Cookie.get("token");
        if (currToken) {
            this.fetchConnections(currToken);
            this.fetchConnectionsIncoming(currToken);
            this.fetchConnectionsOutgoing(currToken);
        }
    }

    fetchConnections(token) {
        axios.get(`${BASE_URL}/connections?token=${token}`)
            .then((connectionsPayload) => {
                this.setState({
                    users: connectionsPayload.data.users
                });
            })
            .catch((err) => {
                const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                Notification.spawnNotification("Fetching connections failed", errorMessage, "danger");
            });
    }

    fetchConnectionsIncoming(token) {
        axios.get(`${BASE_URL}/connections/incoming?token=${token}`)
            .then((connectionsPayload) => {
                this.setState({
                    incomingUsers: connectionsPayload.data.users
                });
            })
            .catch((err) => {
                const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                Notification.spawnNotification("Fetching connections failed", errorMessage, "danger");
            });
    }

    fetchConnectionsOutgoing(token) {
        axios.get(`${BASE_URL}/connections/outgoing?token=${token}`)
            .then((connectionsPayload) => {
                this.setState({
                    outgoingUsers: connectionsPayload.data.users
                });
            })
            .catch((err) => {
                const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                Notification.spawnNotification("Fetching connections failed", errorMessage, "danger");
            });
    }

    render() {
        const { users, incomingUsers, outgoingUsers } = this.state;
        return (
            <div>
                <Notification />
                {/* Add new connection form: */}
                <ConnectionSearch refresh={this.fetchConnections} />
                <ConnectionsList users={users} incomingUsers={incomingUsers} outgoingUsers={outgoingUsers} />
            </div>
        )
    }
}

export default Connections;
