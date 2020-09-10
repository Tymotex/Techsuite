import { faFireAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, CardBody } from 'reactstrap';

class Article extends React.Component {
    render() {
        const { story } = this.props;
        return (
            <Card>
                <CardBody>
                    <a href={story.url}>{story.title}</a>
                    <div>
                        <FontAwesomeIcon icon={faFireAlt} />
                        {" " + story.score}
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default Article;
