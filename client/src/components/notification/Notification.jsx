import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class Notification extends React.Component {
    static spawnNotification(title, message, type) {
        switch (type) {
            case 'info':
                NotificationManager.info(message);
                break;
            case 'success':
                NotificationManager.success(message, title);
                break;
            case 'warning':
                NotificationManager.warning(message, title, 5000);
                break;
            case 'danger':
                NotificationManager.error(message, title, 5000);
                break;
            default:
                NotificationManager.error(message, title, 5000);
                break;
        }
    }

    render() {
        return (
            <>
                <NotificationContainer />
            </>
        );
    }
}

export default Notification;
