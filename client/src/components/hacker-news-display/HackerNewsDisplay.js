import axios from 'axios';
import React from "react";
import FadeIn from 'react-fade-in';
import { Card, CardBody, CardHeader, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { LoadingSpinner } from '../loading-spinner';
import Article from './Article';
import { Paginator } from '../paginator';
import './Display.scss';

class HackerNewsDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            storyIDs: [],
            stories: [],
            currPage: 0,
            numResults: 10
        };
        this.getPage = this.getPage.bind(this);
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        });
        axios.get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
            .then((res) => {
                // Fetching the ID of the top 500 stories
                this.setState({
                    storyIDs: res.data,
                    isLoading: false,
                    fetchSucceeded: false
                });
                this.getPage(0);
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    isLoading: false,
                    fetchSucceeded: false
                });
            });
    }

    async fetchStory(storyID) {
        const story = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${storyID}.json?print=pretty`);
        console.log(story.data);
        return story.data;
    }

    getPage(pageNum) {
        if (this.state.isLoading) {
            return;
        }
        const { numResults, storyIDs } = this.state;
        this.setState({
            stories: [],
            currPage: pageNum,
            isLoading: true,
            fetchSucceeded: false
        });
        storyIDs.slice(pageNum * numResults, numResults * (pageNum + 1)).map(async (eachStoryID) => {
            const story = await this.fetchStory(eachStoryID);
            this.setState({
                stories: [...this.state.stories, story]
            });
        })
        this.setState({
            isLoading: false,
            fetchSucceeded: true
        });
    }

    render() {
        const { stories } = this.state;
        const numStories = this.state.storyIDs.length;
        const numPages = numStories / this.state.numResults;
        return (
            <Card>
                <CardBody>    
                    <h3 className="spaced">Hacker News</h3>                
                    <Paginator flipPage={this.getPage} maxPageNum={Math.ceil(numPages)} />
                    {(this.state.isLoading) ? (
                        <LoadingSpinner />
                    ) : (
                        (this.state.fetchSucceeded) ? (
                            stories.map((story, i) => (
                                <FadeIn key={i} delay="200">
                                    <Article story={story} />
                                </FadeIn>
                            ))
                        ) : (
                            <></>
                        )
                    )}
                </CardBody>
            </Card>
        );
    }
}

export default HackerNewsDisplay;
