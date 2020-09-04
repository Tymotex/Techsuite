import React from 'react';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';
import './Notification.scss';

class Notification extends React.Component {
    constructor(props) {
        super(props);
    }

    static spawnNotification(title, message, type) {
        store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "top-center",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 3500,
                onScreen: true
            }
        });
    }

    render() {
        return (
            <ReactNotification />
        );
    }
}

export default Notification;
