import axios from 'axios';
import React from "react";
import { Card, CardBody, CardHeader, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { LoadingSpinner } from '../loading-spinner';
import Article from './Article';
import { Paginator } from '../paginator';

class HackerNewsDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            stories: []
        }
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        });
        axios.get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
            .then((res) => {
                // Top 500 stories:
                this.setState({
                    isLoading: false,
                    fetchSucceeded: true
                });
                var i = 0;
                res.data.forEach((elem) => {
                    i++;
                    if (i < 10) {
                        axios.get(`https://hacker-news.firebaseio.com/v0/item/${elem}.json?print=pretty`)
                            .then((storyRes) => {
                                this.setState({
                                    stories: [...this.state.stories, storyRes.data]
                                });
                                console.log(this.state);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    isLoading: false,
                    fetchSucceeded: false
                });
            });
    }

    render() {
        const { stories } = this.state;
        return (
            <Card>
                <CardHeader>Hacker News</CardHeader>
                <CardBody>                    
                    <Paginator />
                    {(this.state.isLoading) ? (
                        <LoadingSpinner />
                    ) : (
                        (this.state.fetchSucceeded) ? (
                            stories.map(story => (
                                <Article story={story} />
                            ))
                        ) : (
                            <></>
                        )
                    )}
                    {/* TODO OR use reactstrap's paginate. See react paginate: https://www.npmjs.com/package/react-paginate */}
                </CardBody>
            </Card>
        );
    }
}

export default HackerNewsDisplay;
