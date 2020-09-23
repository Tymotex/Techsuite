import React from 'react';
import { Card, CardText, CardBody, CardImg, CardTitle, CardSubtitle, Button, Row, Col } from 'reactstrap';
import { faStar, faEye, faFileCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import commaNumber from 'comma-number';
import './Display.scss';

class RepoCard extends React.Component {
    render() {
        const { repo } = this.props;
        console.log(repo);
        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col md={3}>
                            <img src={repo.owner.avatar_url} alt="Card image cap" />
                        </Col>
                        <Col md={9}>
                            <strong><a href={repo.html_url} >{repo.full_name}</a></strong>
                            <div>
                                {repo.description}
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <div className="flowRoot">
                        <span className="leftContent">
                            <FontAwesomeIcon icon={faStar} /> {commaNumber(repo.stargazers_count)}
                        </span>
                        <span className="rightContent">
                            {commaNumber(repo.watchers_count)} <FontAwesomeIcon icon={faEye} /> 
                        </span>
                    </div>
                    <div className="flowRoot">
                        <span className="leftContent">
                            Owner: <strong><a className="" href={repo.owner.repos_url}>{repo.owner.login}</a></strong>
                        </span>
                        <span className="rightContent">
                        {repo.language != null ? repo.language : "No language"} <FontAwesomeIcon icon={faFileCode} /> 
                        </span>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default RepoCard;
