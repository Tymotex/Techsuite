import React from 'react';
import DarkModeToggle from 'react-dark-mode-toggle';
import Cookie from 'js-cookie';
import {
    enable as enableDarkMode,
    disable as disableDarkMode
} from 'darkreader';
import './DarkModeSwitch.scss';

class DarkModeSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDarkMode: (props.viewMode === "dark") ? true : false
        };
        this.setIsDarkMode = this.setIsDarkMode.bind(this);
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

    setIsDarkMode() {
        if (this.state.isDarkMode) {
            disableDarkMode();
            Cookie.set("viewMode", "light");
        } else {
            enableDarkMode({
                brightness: 100,
                contrast: 90,
                sepia: 10,
            });
            Cookie.set("viewMode", "dark");
        }
        this.setState({ isDarkMode: !this.state.isDarkMode });
    }
    
    render() {
        const { isDarkMode } = this.state;

        return (
            <div id="darkModeButton">
                <DarkModeToggle
                    onChange={this.setIsDarkMode}
                    checked={isDarkMode}
                    size={100}
                    speed={0.5}
                />
            </div>
        );
    }
}

export default DarkModeSwitch;
