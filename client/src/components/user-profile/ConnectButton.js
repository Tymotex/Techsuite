import React from 'react';
import { Button } from 'reactstrap';
import './ConnectButton.scss';
import Cookie from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';

class ConnectButton extends React.Component {
    constructor(props) {
        super(props);
        this.sendConnectionRequest = this.sendConnectionRequest.bind(this);
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
                    console.log(res);
                    refresh();
                })
                .catch((err) => {
                    alert("Failed");
                });
        } else {

        }
    }

    render() {
        const { isConnected, connectionIsPending, userID, openMessage } = this.props;
        return (
            <div className="connect-button-container">
                {(connectionIsPending) ? (
                    <Button disabled={true}>Pending</Button>
                ) : (
                    (isConnected) ? (
                        // TODO: Add link here to get to private message page
                        <>
                            <Button outline color="primary" onClick={() => openMessage(userID)}>Message</Button>
                            <Button outline color="danger">Remove</Button>
                        </>
                    ) : (
                        <Button onClick={this.sendConnectionRequest}>Connect</Button>
                    )
                )}
            </div>
        );
    }
}

export default ConnectButton;
