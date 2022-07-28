import React from 'react'
import './NeonButton.scss';

class NeonButton extends React.Component {
    constructor(props) {
        super(props);
        this.playSFX = this.playSFX.bind(this);
    }

    playSFX() {
        // Path to audio files start from the project directory's public folder ('/' is the public directory)
        let audio = new Audio("/sfx/click-1.wav");
        audio.play();
    }

    render() {
        const { toggleModal, children, padding, isPillShaped } = this.props;
        return (
            // Note that the 4 empty spans are for styling the 4 sides of the button
            <a className="neon-button" href="# " onClick={() => {
                toggleModal();
                this.playSFX();
            }}
                style={{ padding: padding ? padding: "10px", borderRadius: isPillShaped ? "100px" : '5px' }}
            >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                {children}
            </a>
        );
    }
}

export default NeonButton;
