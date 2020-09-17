import React from 'react';
import DarkModeToggle from 'react-dark-mode-toggle';
import {
    enable as enableDarkMode,
    disable as disableDarkMode,
    auto as followSystemColorScheme,
} from 'darkreader';
import './DarkModeSwitch.scss';

class DarkModeSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDarkMode: props.isDarkMode ? true : false
        };
        this.setIsDarkMode = this.setIsDarkMode.bind(this);
    }

    setIsDarkMode() {
        if (this.state.isDarkMode) {
            disableDarkMode();
        } else {
            enableDarkMode({
                brightness: 100,
                contrast: 90,
                sepia: 10,
            });
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
