import axios from 'axios';
import React from "react";
import { Card, CardBody, CardHeader } from 'reactstrap';
import { LoadingSpinner } from '../loading-spinner';
import { Paginator } from '../paginator';
import { faStar, faEye, faFileCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                    <Paginator />
                    {(this.state.isLoading) ? (
                        <LoadingSpinner />
                    ) : (
                        (this.state.fetchSucceeded) ? (
                            repos.map((eachRepo) => (
                                <div>
                                    <a href={eachRepo.html_url} >{eachRepo.full_name}</a>
                                    <div>
                                        About <strong>{eachRepo.name}</strong>: {eachRepo.description}
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faFileCode} /> 
                                        {eachRepo.language != null ? eachRepo.language : "No language"}
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faStar} /> {`${eachRepo.stargazers_count}`}
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faEye} /> {`${eachRepo.watchers_count}`}
                                    </div>
                                    <div>
                                        Open issues: {eachRepo.open_issues}
                                    </div>
                                    {eachRepo.homepage != null ? (
                                        <div>
                                            <a href={eachRepo.homepage}>Project homepage</a>
                                        </div>
                                     ) : (
                                         <></>
                                     )}
                                </div>
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
