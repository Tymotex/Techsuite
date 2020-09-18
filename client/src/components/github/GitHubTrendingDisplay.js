import axios from 'axios';
import React from "react";
import FadeIn from 'react-fade-in';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { LoadingSpinner } from '../loading-spinner';
import { Paginator } from '../paginator';
import RepoCard from './RepoCard';
import { CarouselDisplay } from '../carousel';
import './Display.scss';

class GitHubTrendingDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            repos: [],
            currPage: 0,
            numResults: 10,
            query: "web"
        };
        this.getPage = this.getPage.bind(this);
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        });
        const { query } = this.state;
        axios.get(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=100`)
            .then((res) => {
                this.setState({
                    isLoading: false,
                    fetchSucceeded: true,
                    repos: res.data.items
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getPage(pageNum) {
        this.setState({
            currPage: pageNum
        });
    }

    render() {
        const { repos, numResults, currPage } = this.state;
        return (
            <Card>
                <CardBody>
                    <CarouselDisplay />
                    <h3 className="spaced">GitHub Trending Repositories</h3>
                    <Paginator flipPage={this.getPage} />
                    {(this.state.isLoading) ? (
                        <LoadingSpinner />
                    ) : (
                        (this.state.fetchSucceeded) ? (
                            repos
                                .slice(currPage * numResults, numResults * (currPage + 1))
                                .map((eachRepo, i) => (
                                    <FadeIn key={i} delay="200">
                                        <RepoCard repo={eachRepo} />
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

export default GitHubTrendingDisplay;
