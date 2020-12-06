import axios from 'axios';
import React from "react";
import FadeIn from 'react-fade-in';
import { Button, Card, CardBody, Form, FormGroup, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { errorNotification } from '../error-notification';
import { LoadingSpinner } from '../loading-spinner';
import { Paginator } from '../paginator';
import './Display.scss';
import RepoCard from './RepoCard';

class GitHubTrendingDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.getPage = this.getPage.bind(this);
        this.fetchRepos = this.fetchRepos.bind(this);
        this.randomiseQuery = this.randomiseQuery.bind(this);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            repos: [],
            currPage: 0,
            numResults: 10,
            query: this.randomiseQuery()
        };
    }

    randomiseQuery() {
        const queryChoices = [
            "web", "deep learning", "machine learning", "fullstack", "react",
            "algorithms", "terminal", "sql", "javascript", "python", "java",
            "rust", "perl", "shell", "scss", "automation", "java", "C", "C#",
            "C++", "unity", "IoT", "raspberry pi", "scala", "haskell", "roadmap",
            "go", "linux", "css", "data visualisation", "data science", "artificial intelligence",
            "socket", "ruby", "docker", "node.js", "flutter", "vim", "vscode",
            "unreal engine", "apache", "kotlin", "jest", "redux", "microsoft",
            "cloud", "web scraping", "flask", "django", "express", "spring",
            "rails", "angular", "vue", "music", "generation", "neural", "network"
        ]
        const randomIndex = Math.floor(Math.random() * queryChoices.length);
        return queryChoices[randomIndex];
    }

    componentWillMount() {
        const { query } = this.state;
        this.fetchRepos(query);
    }

    fetchRepos(query) {
        this.setState({
            isLoading: true
        });
        axios.get(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=100`)
            .then((res) => {
                this.setState({
                    isLoading: false,
                    fetchSucceeded: true,
                    repos: res.data.items
                });
            })
            .catch((err) => {
                errorNotification(err, "Failed to fetch repos from GitHub");
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
                    <Form className="search-form" onSubmit={(event) => {
                        event.preventDefault();
                        this.fetchRepos(document.getElementById("dynamic-search-field").value);
                    }}>
                        <FormGroup>
                            <InputGroup>
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
