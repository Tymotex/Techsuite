import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';
import { withRouter } from 'react-router-dom';
import { NavItem } from 'reactstrap';
import AvatarDropdown from './AvatarDropdown';
import LogInModal from './LogInModal';
import RegisterModal from './RegisterModal';

class TopNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            profileImgURL: "",
            username: ""
        };
        this.logout = this.logout.bind(this);
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
  
    logout() {
        console.log("CLEARED COOKIES. User is now logged out");
        Cookie.remove("token");
        Cookie.remove("user_id");
        this.props.history.push("/home");
        this.setState({
            loggedIn: false,
            profileImgURL: "",
            username: ""
        })
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
                            <LogInModal />
                            {/* <NavLink to="/auth/login"><Button color="primary"><LogIn /> Log In</Button></NavLink> */}
                        </NavItem> 
                        <NavItem style={paddedNavItem}>
                            <RegisterModal />
                            {/* <NavLink to="/auth/register"><Button color="primary"><UserPlus /> Register</Button></NavLink> */}
                        </NavItem> 
                    </>
                )
                }
            </>
        );
    }
}
  
export default withRouter(TopNav);
