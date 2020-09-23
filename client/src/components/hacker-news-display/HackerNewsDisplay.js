import axios from 'axios';
import React from "react";
import FadeIn from 'react-fade-in';
import { Card, CardBody, Nav, NavItem, NavLink } from 'reactstrap';
import { LoadingSpinner } from '../loading-spinner';
import { Paginator } from '../paginator';
import Article from './Article';
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
            numResults: 10,
            mode: "hot"
        };
        this.getPage = this.getPage.bind(this);
        this.setMode = this.setMode.bind(this);
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        });
        axios.get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
            .then((res) => {
                // Fetching the ID of the top 100 stories
                this.setState({
                    storyIDs: res.data.slice(0, 100),
                    isLoading: false,
                    fetchSucceeded: false
                });
                this.state.storyIDs.map(async (eachStoryID) => {
                    const story = await this.fetchStory(eachStoryID);
                    this.setState({
                        stories: [...this.state.stories, story],
                        fetchSucceeded: true,
                        isLoading: false
                    });
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

    async fetchStory(storyID) {
        const story = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${storyID}.json?print=pretty`);
        return story.data;
    }

    getPage(pageNum) {
        this.setState({
            currPage: pageNum
        });
    }

    setMode(mode) {
        switch (mode) {
            case "hot":
                // Sorting articles in ascending order of score : time ratio
                this.state.stories.sort((a, b) => {
                    return ((a.score / a.time) > (b.score / b.time)) ? -1 : 1;
                });
                break;
            case "top":
                // Sorting articles in ascending order of score
                this.state.stories.sort((a, b) => {
                    return (a.score > b.score) ? -1 : 1;
                });
                break;
            case "latest":
                // Sorting articles in descending order of timestamp value
                this.state.stories.sort((a, b) => {
                    return (a.time > b.time) ? -1 : 1;
                });
                break;
        }
        this.setState({
            mode: mode
        });
    }

    render() {
        const { stories, mode, isLoading, fetchSucceeded, currPage, numResults } = this.state;
        const numStories = this.state.storyIDs.length;
        const numPages = numStories / this.state.numResults;
        return (
            <Card>
                <CardBody>   
                    <h3 className="spaced">Hacker News</h3>     
                    <Nav tabs>
                        <NavItem>
                            <NavLink href="#" active={mode === "hot"} onClick={() => this.setMode("hot")}>Hot</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#" active={mode === "top"} onClick={() => this.setMode("top")}>Top</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#" active={mode === "latest"} onClick={() => this.setMode("latest")}>Latest</NavLink>
                        </NavItem>
                    </Nav>           
                    <Paginator flipPage={this.getPage} maxPageNum={Math.ceil(numPages)} />
                    {(isLoading) ? (
                        <LoadingSpinner />
                    ) : (
                        (fetchSucceeded) ? (
                            stories
                                .slice(currPage * numResults, numResults * (currPage + 1))
                                .map((story, i) => (
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
