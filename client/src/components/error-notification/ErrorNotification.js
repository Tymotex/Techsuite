import { REQUEST_ERR_MESSAGE } from '../../constants/message';
import { Notification } from '../notification';

const errorNotification = (err, errSummaryMessage) => {
    let errorMessage = REQUEST_ERR_MESSAGE;
    if (err.response) {
        errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
    } 
    Notification.spawnNotification(errSummaryMessage, errorMessage, "danger");
}

export default errorNotification;
