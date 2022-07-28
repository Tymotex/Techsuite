import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { Notification } from '../../components/notification';
import { BASE_URL } from '../../constants/api-routes';
import Empty from './Empty';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.reset = this.reset.bind(this);
    }

    reset() {
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            axios.get(`${BASE_URL}/admin/reset`)
                .then((response) => {
                    if (response.data.succeeded) {
                        Notification.spawnNotification("Success", "Database reset successfully", "success");
                    } else {
                        Notification.spawnNotification("Failure", "Database failed to reset", "danger");
                    }
                })
                .catch((err) => {
                    Notification.spawnNotification("Failure", "Database failed to reset. Server may be be down", "danger");
                });
        } else {
            Notification.spawnNotification("Failure", "You don't have permission. Please log in first", "danger");
        }
    }

    render() {
        return (
            <Empty />
        );
    }
}

export default Admin;
