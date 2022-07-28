import { faEye, faFileCode, faHome, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import commaNumber from 'comma-number';
import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import './Display.scss';

class RepoCard extends React.Component {
  render() {
    const { repo } = this.props;
    console.log(repo);
    return (
      <Card>
        <CardBody>
          <Row style={{ maxHeight: '175px' }}>
            <Col md={3}>
              <a href={repo.html_url}>
                <img className="owner-img" src={repo.owner.avatar_url} alt="Owner's avatar" />
              </a>
            </Col>
            <Col md={9} style={{ overflow: 'auto', height: '175px' }}>
              <strong>
                <a href={repo.html_url}>{repo.full_name}</a>
              </strong>
              {repo.homepage != null ? (
                <div style={{ float: 'right' }}>
                  <a href={repo.homepage}>
                    <FontAwesomeIcon icon={faHome} />
                  </a>
                </div>
              ) : (
                <></>
              )}
              <div>{repo.description}</div>
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
              Owner:{' '}
              <strong>
                <a className="" href={repo.owner.html_url}>
                  {repo.owner.login}
                </a>
              </strong>
            </span>
            <span className="rightContent">
              {repo.language != null ? repo.language : 'No language'} <FontAwesomeIcon icon={faFileCode} />
            </span>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default RepoCard;
