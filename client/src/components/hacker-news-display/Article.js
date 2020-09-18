import { faFireAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import moment from 'moment-timezone';
import { Card, CardBody } from 'reactstrap';
import parse from 'html-react-parser';
import capitalize from 'capitalize';

class Article extends React.Component {

    truncate(str, n, useWordBoundary){
        if (str.length <= n) { return str; }
        const subString = str.substr(0, n-1);
        return (useWordBoundary 
            ? subString.substr(0, subString.lastIndexOf(" ")) 
            : subString) + "&hellip;";
    };

    render() {
        const { story } = this.props;
        let { title, url, score, by, time, text } = story;

        const shortFormattedTime = moment.unix(time).tz("Australia/Sydney").format("DD/MM/YY, h:mm A");

        if (text) {
            text = capitalize(text);
            text = this.truncate(text, 1000, true);
            console.log(text);
        }

        return (
            <Card>
                <CardBody>
                    <strong><a href={url}>{title}</a></strong>
                    {text && parse(`<div class='text-muted'>${text}</div>`)}
                    <div>
                        By: {by}
                    </div>
                    <div>
                        Posted: {shortFormattedTime}
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faFireAlt} />
                        {" " + score}
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default Article;
