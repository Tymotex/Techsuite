import React, { Component } from 'react';
import ProfilePictureForm from '../picture-form/ProfilePictureForm';
import ProfileCoverForm from '../picture-form/ProfileCoverForm';
import { Row, Col, Card, CardBody } from 'reactstrap';
import BioEditForm from './BioEditForm';

class UserProfileEditForm extends Component {
	render() {
		return (
			<>
				<Card>
					<CardBody>
						<BioEditForm userID={this.props.userID} />
						<hr />
					</CardBody>
				</Card>

				<Row>
					<Col md={6}>
						<Card>
							<CardBody>
								<ProfilePictureForm />
							</CardBody>
						</Card>
					</Col>
					<Col md={6}>
						<Card>
							<CardBody>
								<ProfileCoverForm />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</>
		);
	}
}

export default UserProfileEditForm;
