import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';
import { withRouter } from 'react-router-dom';
import { NavItem } from 'reactstrap';
import AvatarDropdown from './AvatarDropdown';
import LogInModal from './LogInModal';
import RegisterModal from './RegisterModal';

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
                    alert(err);
                });
        }
    }

    saveSession(res) {
        console.log("Successfully logged in");
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
        console.log("Cleared cookies. User is now logged out");
        Cookie.remove("token");
        Cookie.remove("user_id");
        this.props.history.push("/home");
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
            })
            .catch((err) => {
                console.log(err);
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
            })
            .catch((err) => {
                console.log(err);
            })
    }

    logout() {
        this.wipeSession();
    }
  
    render() {
        const paddedNavItem = {
            paddingTop: "10px",
            paddingRight: "10px"
        };
  
        const currUserID = parseInt(Cookie.get("user_id"));
        const { loggedIn, username, profileImgURL } = this.state;
        return (
            <>
                {/* Rendering the profile dropdown */}
                {(loggedIn) ? (
                    <>
                        <NavItem style={paddedNavItem}>
                            Welcome <strong>{username}</strong>
                        </NavItem>
                        <AvatarDropdown profileImgURL={profileImgURL} userID={currUserID} logout={this.logout} />
                    </> 
                ) : (
                    <>
                        <NavItem style={paddedNavItem}>
                            <LogInModal login={this.logInUser}/>
                            {/* <NavLink to="/auth/login"><Button color="primary"><LogIn /> Log In</Button></NavLink> */}
                        </NavItem> 
                        <NavItem style={paddedNavItem}>
                            <RegisterModal register={this.registerUser} />
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
