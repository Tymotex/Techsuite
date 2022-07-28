import React from 'react';
import { HackerNewsDisplay } from '../../components/hacker-news-display';
import { GitHubTrendingDisplay } from '../../components/github';
import { Row, Col } from 'reactstrap';
import { motion } from 'framer-motion';

class News extends React.Component {
  render() {
    return (
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <Row>
          <Col md={6}>
            <GitHubTrendingDisplay />
          </Col>
          <Col md={6}>
            <HackerNewsDisplay />
          </Col>
        </Row>
      </motion.div>
    );
  }
}

export default News;
