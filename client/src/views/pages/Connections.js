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
    }

    render() {
        return (
            <div>
                <Notification />
                {/* Add new connection form: */}
                <ConnectionsList />
            </div>
        )
    }
}

export default Connections;
