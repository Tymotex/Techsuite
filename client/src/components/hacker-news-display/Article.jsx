import { faFireAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import capitalize from 'capitalize';
import parse from 'html-react-parser';
import moment from 'moment-timezone';
import React from 'react';
import { ReactTinyLink } from 'react-tiny-link';
import { Card, CardBody } from 'reactstrap';

class Article extends React.Component {
  render() {
    const { story } = this.props;
    let { title, url, score, by, time, text } = story;

    const shortFormattedTime = moment.unix(time).tz('Australia/Sydney').format('DD/MM/YY, h:mm A');

    if (text) {
      text = capitalize(text);
    }

    console.log(story);

    return (
      <Card style={{ marginBottom: '24px', boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px' }}>
        {/* HTTP link preview */}
        <CardBody style={{ margin: '10px 24px' }}>
          <span style={{ float: 'right' }}>
            <FontAwesomeIcon icon={faFireAlt} />
            {' ' + score}
          </span>
          <div>
            <h4>{title}</h4>
            <p style={{ maxHeight: '100px', overflow: 'auto', margin: 0 }}>
              {text && parse(`<div class='text-muted'>${text}</div>`)}
            </p>
            <p className="text-muted" style={{ margin: '10px 0 0 0' }}>
              By <em>{by}</em>
            </p>
            <p className="text-muted" style={{ display: 'inline' }}>
              Posted: {shortFormattedTime}
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default Article;
