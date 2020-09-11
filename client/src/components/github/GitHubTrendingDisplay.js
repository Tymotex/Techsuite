import axios from 'axios';
import React from "react";
import { Card, CardBody, CardHeader, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { LoadingSpinner } from '../loading-spinner';
import ReactPaginate from 'react-paginate';
const trending = require("trending-github");

class GitHubTrendingDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            repos: []
        }
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        });
        alert("");
        axios.get("https://api.github.com/search/repositories?q=web&sort=stars&order=desc")
            .then((res) => {
                this.setState({
                    isLoading: false,
                    fetchSucceeded: true,
                    repos: res.data.items
                });
                console.log(this.state.repos);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        const { repos } = this.state;
        return (
            <Card>
                <CardHeader>GitHub Trending</CardHeader>
                <CardBody>
                    {repos.map((eachRepo) => (
                        <div>
                            <a href={eachRepo.html_url} >{eachRepo.full_name}</a>
                            <div>
                                Language: {eachRepo.language}
                            </div>
                            <div>
                                Stars: {eachRepo.stargazers_count}
                            </div>
                            <div>
                                Watchers: {eachRepo.watchers_count}
                            </div>
                        </div>
                    ))}
                </CardBody>
            </Card>
        );
    }
}

export default GitHubTrendingDisplay;
