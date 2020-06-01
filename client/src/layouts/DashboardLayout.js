import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SidebarNav, Footer, PageContent, Chat, PageAlert, Page } from '../UI';
import Logo from '../assets/images/techsuite-icon.png';
import avatar1 from '../assets/images/avatar1.png';
import nav from '../_nav';
import routes from '../views';
import ContextProviders from '../UI/components/utilities/ContextProviders';
import handleKeyAccessibility, { handleClickAccessibility } from '../UI/helpers/handleTabAccessibility';

import { TopNavItems } from '../components/top-nav';
import Header from '../UI/components/Header/Header';

const MOBILE_SIZE = 992;

class DashboardLayout extends React.Component {
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
						logoText="Techsuite."
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
						<TopNavItems />
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

export default DashboardLayout;
