import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';
import { withRouter } from 'react-router-dom';
import { NavItem } from 'reactstrap';
import AvatarDropdown from './AvatarDropdown';
import LogInModalButton from './LogInModalButton';
import RegisterModalButton from './RegisterModalButton';
import { Notification } from '../notification';
import { DarkModeSwitch } from "../dark-mode-toggle";
import './TopNavItem.scss';

class TopNavItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            profileImgURL: "",
            username: ""
        };
        this.logout = this.logout.bind(this);
        this.logInUser = this.logInUser.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.saveSession = this.saveSession.bind(this);
        this.wipeSession = this.wipeSession.bind(this);
    }
  
    // Make an API call to get the profile image URL to display on the top navbar
    // if the user is signed in
    componentDidMount() {
        const currUserToken = Cookie.get("token");
        const currUserID = parseInt(Cookie.get("user_id"));
        if (currUserToken) {
            axios.get(`${BASE_URL}/users/profile?token=${currUserToken}&user_id=${currUserID}`)
                .then((res) => {
                    this.setState({
                        loggedIn: true,
                        username: `${res.data.username}`,
                        profileImgURL: res.data.profile_img_url
                    });
                })
                .catch((err) => {
                    // const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    // Notification.spawnNotification("Viewing user profile failed", errorMessage, "danger");
                });
        }
    }

    saveSession(res) {
        this.setState({
            loggedIn: true,
            profileImgURL: res.data.profile_img_url,
            username: res.data.username
        });
        // Storing the JWT token inside the browser session storage 
        Cookie.set("token", res.data.token);
        Cookie.set("user_id", res.data.user_id);
        // this.props.history.push("/home");
    }

    wipeSession() {
        Cookie.remove("token");
        Cookie.remove("user_id");
        this.setState({
            loggedIn: false,
            profileImgURL: "",
            username: ""
        })
    }
    
    logInUser(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const postData = {
            method: 'post',
            url: `${BASE_URL}/auth/login`,
            data: {
                email: data.get("email"),
                password: data.get("password")
            },
            headers: {
                "Content-Type": "application/json"
            }
        };
        axios(postData)
            .then((res) => {
                this.saveSession(res);
                this.props.history.push("/home");
                Notification.spawnNotification("Login success", "You have logged in successfully", "success");
            })
            .catch((err) => {
                const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                Notification.spawnNotification("Login failure", errorMessage, "danger");
            });
    }

    registerUser = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        
        const postData = {
            method: 'post',
            url: `${BASE_URL}/auth/register`,
            data: {
                username: data.get("username"),
                email: data.get("email"),
                password: data.get("password")
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios(postData)
            .then((res) => {
                this.saveSession(res);
                this.props.history.push("/home");
                Notification.spawnNotification("Register success", "You have registered successfully", "success");
            })
            .catch((err) => {
                const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                Notification.spawnNotification("Registration failed", errorMessage, "danger");
            });
    }

    logout() {
        this.wipeSession();
        Notification.spawnNotification("Logout success", "You have logged out successfully. Bye!", "success");
        this.props.history.push("/home");
    }
  
    render() {
        const currUserID = parseInt(Cookie.get("user_id"));
        const { loggedIn, username, profileImgURL } = this.state;
        
        return (
            <>

                <NavItem className="navItemSwitchCenter">
                    <DarkModeSwitch viewMode={Cookie.get("viewMode")} />
                </NavItem>
                {/* Rendering the profile dropdown */}
                {(loggedIn) ? (
                    <>
                        <NavItem className="navItemCenter navItemText">
                            Welcome <strong>{username}</strong>
                        </NavItem>
                        <NavItem className="navItemCenter">
                            <AvatarDropdown profileImgURL={profileImgURL} userID={currUserID} logout={this.logout} />
                        </NavItem>
                    </> 
                ) : (
                    <>
                        <NavItem>
                            <LogInModalButton login={this.logInUser}/>
                            {/* <NavLink to="/auth/login"><Button color="primary"><LogIn /> Log In</Button></NavLink> */}
                        </NavItem> 
                        <NavItem>
                            <RegisterModalButton register={this.registerUser} />
                            {/* <NavLink to="/auth/register"><Button color="primary"><UserPlus /> Register</Button></NavLink> */}
                        </NavItem> 
                    </>
                )
                }
            </>
        );
    }
}  

export default withRouter(TopNavItems);
