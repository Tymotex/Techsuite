import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import dropdownStyles from "./AvatarDropdown.module.scss";

const AvatarDropdown = (props) => {
    const { profileImgURL, userID, logout } = props;
    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav>
                <Avatar size="lg" color="black" image={profileImgURL} />
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem>
                    <Link className={dropdownStyles.dropdownLink} to={`/user/profile/${userID}`}>View my profile</Link>
                </DropdownItem>
                <DropdownItem>
                    <Link className={dropdownStyles.dropdownLink} to={`/user/profile/${userID}/edit`}>Edit my profile</Link>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem className={dropdownStyles.dropdownLink} onClick={logout}>
                    Log out
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    );
}
  
AvatarDropdown.propTypes = {
    profileImgURL: PropTypes.string.isRequired,
    userID: PropTypes.number.isRequired
};

export default AvatarDropdown;
