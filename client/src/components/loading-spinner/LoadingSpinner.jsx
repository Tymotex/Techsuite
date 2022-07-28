import React from 'react';
import spin from './svgs/spin.svg';
import bars from './svgs/bars.svg';
import puff from './svgs/puff.svg';
import dots from './svgs/dots.svg';

const Loader = ({ small, type }) => {
    let loaderType;
    switch (type) {
        case "bars":
            loaderType = bars;
            break;
        case "spin":
            loaderType = spin;
            break;
        case "puff":
            loaderType = puff;
            break;
        case "dots":
            loaderType = dots;
            break;
        default:
            loaderType = bars;
    }
    const size = small ? 'small' : '';

    return (
        <div className={`loader ${size}`} style={{ backgroundImage: `url(${loaderType})` }}></div>
    );
}

export default Loader;
