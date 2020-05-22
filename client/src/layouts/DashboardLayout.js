import React, { Component } from 'react';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import { Header, SidebarNav, Footer, PageContent, Avatar, Chat, PageAlert, Page } from '../vibe';
import Logo from '../assets/images/techsuite-icon.png';
import avatar1 from '../assets/images/avatar1.png';
import nav from '../_nav';
import routes from '../views';
import ContextProviders from '../vibe/components/utilities/ContextProviders';
import handleKeyAccessibility, { handleClickAccessibility } from '../vibe/helpers/handleTabAccessibility';

import axios from 'axios';
import Cookie from 'js-cookie';
import { BASE_URL } from '../constants/api-routes';
import { UserPlus, LogIn, LogOut, Sign } from 'react-feather';

const MOBILE_SIZE = 992;

export default class DashboardLayout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sidebarCollapsed: false,
			isMobile: window.innerWidth <= MOBILE_SIZE,
			showChat1: true,
		};
	}

	handleResize = () => {
		if (window.innerWidth <= MOBILE_SIZE) {
			this.setState({ sidebarCollapsed: false, isMobile: true });
		} else {
			this.setState({ isMobile: false });
		}
	};

	componentDidUpdate(prev) {
		if (this.state.isMobile && prev.location.pathname !== this.props.location.pathname) {
			this.toggleSideCollapse();
		}
	}

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('keydown', handleKeyAccessibility);
    document.addEventListener('click', handleClickAccessibility);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  toggleSideCollapse = () => {
    this.setState(prevState => ({ sidebarCollapsed: !prevState.sidebarCollapsed }));
  };

  closeChat = () => {
    this.setState({ showChat1: false });
  };

  render() {
    const { sidebarCollapsed } = this.state;
    const sidebarCollapsedClass = sidebarCollapsed ? 'side-menu-collapsed' : '';
    return (
      <ContextProviders>
        <div className={`app ${sidebarCollapsedClass}`}>
          <PageAlert />
          <div className="app-body">
            <SidebarNav
              nav={nav}
              logo={Logo}
              logoText="Techsuite"
              isSidebarCollapsed={sidebarCollapsed}
              toggleSidebar={this.toggleSideCollapse}
              {...this.props}
            />
            <Page>
              <Header
                toggleSidebar={this.toggleSideCollapse}
                isSidebarCollapsed={sidebarCollapsed}
                routes={routes}
                {...this.props}
              >
                <HeaderNav />
              </Header>
              <PageContent>
                <Switch>
                  {routes.map((page, key) => (
                    <Route path={page.path} component={page.component} key={key} />
                  ))}
                  <Redirect from="/" to="/home" />
                </Switch>
              </PageContent>
            </Page>
          </div>
          <Footer>
          </Footer>
          <Chat.Container>
            {this.state.showChat1 && (
              <Chat.ChatBox name="Messages" status="online" image={avatar1} close={this.closeChat} />
            )}
          </Chat.Container>
        </div>
      </ContextProviders>
    );
  }
}

// Header definition:
class HeaderNav extends React.Component {
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
    const currUserID = Cookie.get("user_id");
    if (currUserToken) {
      axios.get(`${BASE_URL}/users/profile?token=${currUserToken}&u_id=${currUserID}`)
        .then((res) => {
          this.setState({
            loggedIn: true,
            username: `${res.data.name_first} ${res.data.name_last}`,
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
  }

  render() {
    const paddedNavItem = {
      paddingTop: "10px",
      paddingRight: "10px"
    };

    return (
      <React.Fragment>
        {/* PROFILE DROPDOWN: */}
        {(this.state.loggedIn) ? 
          <>
            <NavItem style={paddedNavItem}>
              Welcome <strong>{this.state.username}</strong>
            </NavItem>
            <AvatarDropdown profileImgURL={this.state.profileImgURL} />
          </> :
          <>
            <NavItem style={paddedNavItem}>
              <NavLink to="/auth/login"><Button color="primary"><LogIn /> Log In</Button></NavLink>
            </NavItem> 
            <NavItem style={paddedNavItem}>
              <NavLink to="/auth/register"><Button color="primary"><UserPlus /> Register</Button></NavLink>
            </NavItem> 
          </>
        }
        
      </React.Fragment>
    );
  }
}

const AvatarDropdown = (props) => {
  const { profileImgURL } = props;
  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav>
        <Avatar size="small" color="black" image={profileImgURL} />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem>View my profile</DropdownItem>
        <DropdownItem>Edit my profile</DropdownItem>
        <DropdownItem divider />
        <DropdownItem>
          Log out
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

