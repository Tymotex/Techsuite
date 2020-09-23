import axios from 'axios';
import React from "react";
import FadeIn from 'react-fade-in';
import { Card, CardBody, Form, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Button } from 'reactstrap';
import { LoadingSpinner } from '../loading-spinner';
import { Paginator } from '../paginator';
import RepoCard from './RepoCard';
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
        this.fetchRepos = this.fetchRepos.bind(this);
    }

    componentWillMount() {
        const { query } = this.state;
        this.fetchRepos(query);
    }

    fetchRepos(query) {
        
        this.setState({
            isLoading: true
        });
        // alert("Query: " + query);
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
        const { repos, numResults, currPage, query } = this.state;

        const numRepos = repos.length;
        const numPages = numRepos / numResults;

        return (
            <Card>
                <CardBody>
                    <h3 className="spaced">GitHub Trending Projects</h3>

                    {/* Dynamic Search Field */}
                    <Form onSubmit={(event) => {
                        event.preventDefault();
                        this.fetchRepos(document.getElementById("dynamic-search-field").value);
                    }}>
                        <FormGroup>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>Search for</InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                    id="dynamic-search-field" 
                                    name="queryString" 
                                    placeholder="Start typing..." 
                                    defaultValue={query} 
                                    autocomplete="off" />
                                <InputGroupAddon addonType="append">
                                    <Button color="secondary">Search</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                    </Form>

                    <Paginator flipPage={this.getPage} maxPageNum={Math.ceil(numPages)} />
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
