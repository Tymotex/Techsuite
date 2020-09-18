import React from 'react';
import { HackerNewsDisplay } from '../../components/hacker-news-display';
import { GitHubTrendingDisplay } from '../../components/github';
import { Row, Col } from 'reactstrap';

class News extends React.Component {
    render() {
        return (
            <Row>
                <Col md={6}>
                    <GitHubTrendingDisplay />
                </Col>
                <Col md={6}>
                    <HackerNewsDisplay />
                </Col>
            </Row>
        );
    }
}

export default News;
