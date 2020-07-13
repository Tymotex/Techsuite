import React from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { BASE_URL } from '../../constants/api-routes';

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
                        alert("Succeeded");
                    } else {
                        alert("Failed");
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        } else {
            alert("TOKEN WAS NOT FOUND IN COOKIE");
        }
    }

    render() {
        return (
            <div><strong onClick={this.reset}>Click me to reset</strong></div>
        );
    }
}

export default Admin;
