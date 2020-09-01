import React, { Component } from 'react';
import ProfilePictureForm from '../picture-form/ProfilePictureForm';
import ProfileCoverForm from '../picture-form/ProfileCoverForm';
import { Row, Col, Card, CardBody } from 'reactstrap';
import BioEditForm from './BioEditForm';

class UserProfileEditForm extends Component {
	render() {
		return (
			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							<BioEditForm userID={this.props.userID} />
							<hr />
							<Row>
								<Col md={6}>
									<ProfilePictureForm />
								</Col>
								<Col md={6}>
									<ProfileCoverForm />
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>
		);
	}
}

export default UserProfileEditForm;
