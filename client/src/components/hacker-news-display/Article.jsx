import { faFireAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import moment from 'moment-timezone';
import { Card, CardBody } from 'reactstrap';
import parse from 'html-react-parser';
import capitalize from 'capitalize';
import { ReactTinyLink } from 'react-tiny-link'

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
        }

        return (
            <Card>
                <CardBody>
                    {/* HTTP link preview */}
                    <div className="link-preview-card">
                        <ReactTinyLink
                            cardSize="small"
                            showGraphic={true}
                            maxLine={2}
                            minLine={1}
                            url={url}
                        />
                    </div>
                    <div>
                        <strong>{title}</strong>
                    </div>
                    {text && parse(`<div class='text-muted'>${text}</div>`)}
                    <div>
                        By: <em>{by}</em>
                        <span style={{"float": "right"}}>
                            <FontAwesomeIcon icon={faFireAlt} />
                            {" " + score}
                        </span>
                    </div>
                    <div>
                        Posted: <p className="text-muted" style={{"display": "inline"}}>{shortFormattedTime}</p>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default Article;
