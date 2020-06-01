import React from 'react'
import './NeonButton.scss';

const NeonButton = (props) => {
    return (
        // The 4 spans are for styling the 4 sides of the button
        <a class="neon-button" onClick={props.toggleModal}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {props.children}
        </a>
    )
}

export default NeonButton;
