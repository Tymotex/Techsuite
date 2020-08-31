import React, { Component } from 'react';
import ProfilePictureForm from '../picture-form/ProfilePictureForm';
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
							<ProfilePictureForm />
						</CardBody>
					</Card>
				</Col>
			</Row>
		);
	}
}

export default UserProfileEditForm;
