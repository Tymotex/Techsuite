import React from 'react';
import { HackerNewsDisplay } from '../../components/hacker-news-display';
import { Row, Col } from 'reactstrap';

class News extends React.Component {
    render() {
        return (
            <Row>
                <Col md={6}>
                    <HackerNewsDisplay />
                </Col>
                <Col md={6}>

                </Col>
            </Row>
        );
    }
}

export default News;
