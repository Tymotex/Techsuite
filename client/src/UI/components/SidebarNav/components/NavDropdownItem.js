import React, { Component } from 'react';
import * as Feather from 'react-feather';
import NavBadge from './NavBadge';
import NavSingleItem from './NavSingleItem';

class NavDropdownItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
		this.toggle = this.toggle.bind(this);
		this.playSFX = this.playSFX.bind(this);
	}
	
	toggle = (e) => {
		this.setState(prevState => ({ open: !prevState.open }));
		e.preventDefault();
		e.stopPropagation();
		this.playSFX();
	};

	playSFX() {
		// Path to audio files start from the project directory's public folder ('/' is the public directory)
		let audio = new Audio("/sfx/click-2.wav");
		audio.play();
	}

	render() {
		const { item } = this.props;
		const isExpanded = this.state.open ? 'open' : '';
		const Icon = item.icon ? Feather[item.icon] : null;
		const ExpandIcon = this.state.open ? Feather.ChevronDown : Feather.ChevronRight;
		return (
			<li className={`nav-item has-submenu ${isExpanded}`}>
				<a href="#!" role="button" onClick={this.toggle}>
				{item.icon && Icon && <Icon className="side-nav-icon" />}
				<span className="nav-item-label">{item.name}</span>{' '}
				{item.badge && (
					<NavBadge color={item.badge.variant} text={item.badge.text} />
				)}
				<ExpandIcon className="menu-expand-icon" />
				</a>
				{(this.state.open || this.props.isSidebarCollapsed) && (
					<ul className="nav-submenu">
						{item.children.map((item, index) => (
						<NavSingleItem item={item} key={index} />
						))}
					</ul>
				)}
			</li>
		);
	}
}


export default NavDropdownItem;
