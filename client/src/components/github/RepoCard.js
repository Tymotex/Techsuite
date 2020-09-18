import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { faStar, faEye, faFileCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class RepoCard extends React.Component {
    render() {
        const { repo } = this.props;
        return (
            <Card>
                <CardBody>
                    <strong><a href={repo.html_url} >{repo.full_name}</a></strong>
                    <div>
                        About <strong>{repo.name}</strong>: {repo.description}
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faFileCode} /> 
                        {repo.language != null ? repo.language : "No language"}
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faStar} /> {`${repo.stargazers_count}`}
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faEye} /> {`${repo.watchers_count}`}
                    </div>
                    <div>
                        Open issues: {repo.open_issues}
                    </div>
                    {repo.homepage != null ? (
                        <div>
                            <a href={repo.homepage}>Project homepage</a>
                        </div>
                    ) : (
                        <></>
                    )}
                </CardBody>
            </Card>
        );
    }
}

export default RepoCard;
