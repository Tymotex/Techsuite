import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { disable as disableDarkMode, enable as enableDarkMode } from 'darkreader';
import Cookie from 'js-cookie';
import React from 'react';
import './DarkModeSwitch.scss';

class DarkModeSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: props.viewMode === 'dark' ? true : false,
    };
    this.setIsDarkMode = this.toggleDarkMode.bind(this);
  }

  componentDidMount() {
    if (this.state.isDarkMode) {
      enableDarkMode({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
    } else {
      disableDarkMode();
    }
  }

  toggleDarkMode() {
    if (this.state.isDarkMode) {
      disableDarkMode();
      Cookie.set('viewMode', 'light');
    } else {
      enableDarkMode({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
      Cookie.set('viewMode', 'dark');
    }
    this.setState({ isDarkMode: !this.state.isDarkMode });
  }

  render() {
    const { isDarkMode } = this.state;

    return (
      <div id="darkModeButton">
        {isDarkMode ? (
          <FontAwesomeIcon icon={faMoon} size={'2x'} onClick={() => this.toggleDarkMode()} />
        ) : (
          <FontAwesomeIcon icon={faSun} size={'2x'} onClick={() => this.toggleDarkMode()} />
        )}
        {/* <DarkModeToggle
                    onChange={this.setIsDarkMode}
                    checked={isDarkMode}
                    size={64}
                    speed={0.5}
                /> */}
      </div>
    );
  }
}

export default DarkModeSwitch;
