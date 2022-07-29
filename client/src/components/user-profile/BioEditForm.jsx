import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { errorNotification } from '../error-notification';
import { Notification } from '../notification';
import './BioEditForm.scss';
import editFormStyles from './BioField.module.scss';

class BioEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      fetchSucceeded: false,
      user: {},
      bio: {},
      value: '',
    };
    this.updateBio = this.updateBio.bind(this);
    this.updateAccountInfo = this.updateAccountInfo.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState({
      isLoading: true,
    });
    const currUserToken = Cookie.get('token');
    if (currUserToken) {
      // Now fetch the user's bio
      axios
        .get(`${BASE_URL}/users/bio?token=${currUserToken}&user_id=${this.props.userID}`)
        .then((userBio) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: true,
            bio: userBio.data,
          });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            fetchSucceeded: false,
          });
          errorNotification(err, 'Viewing user bio failed');
        });
    } else {
      this.setState({
        isLoading: false,
        fetchSucceeded: false,
      });
      Notification.spawnNotification('Failed', 'Please log in first', 'danger');
    }
  }

  updateBio(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const currUserToken = Cookie.get('token');
    if (currUserToken) {
      const postData = {
        method: 'post',
        url: `${BASE_URL}/users/bio`,
        data: {
          token: currUserToken,
          user_id: this.props.userID,
          first_name: fd.get('first_name'),
          last_name: fd.get('last_name'),
          cover_img_url: fd.get('cover_img_url'),
          summary: fd.get('summary'),
          title: fd.get('title'),
          education: fd.get('education'),
          location: fd.get('location'),
        },
        headers: { 'Content-Type': 'application/json' },
      };
      axios(postData)
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          errorNotification(err, 'Updating bio failed');
        });
    }
  }

  updateAccountInfo(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const currUserToken = Cookie.get('token');
    if (currUserToken) {
      const postData = {
        method: 'post',
        url: `${BASE_URL}/users/profile`,
        data: {
          token: currUserToken,
          email: fd.get('email'),
          username: fd.get('username'),
        },
        headers: { 'Content-Type': 'application/json' },
      };
      axios(postData)
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          errorNotification(err, 'Updating account info failed');
        });
    }
  }

  render() {
    const { first_name, last_name, summary, location, title, education, email, username } = this.state.bio;

    return (
      <div>
        <Card style={{ padding: '28px' }}>
          <CardBody>
            <Form onSubmit={this.updateAccountInfo}>
              <h3 style={{ textAlign: 'left', marginBottom: '24px' }}>Update Account Info.</h3>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ width: '120px' }}>Username</InputGroupText>
                  </InputGroupAddon>
                  <Input name="username" defaultValue={username} autoComplete="off" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ width: '120px' }}>Email</InputGroupText>
                  </InputGroupAddon>
                  <Input name="email" defaultValue={email} autoComplete="off" />
                </InputGroup>
              </FormGroup>
              <Button color="primary" style={{ borderRadius: '100px', display: 'block', margin: '0 0 0 auto' }}>
                Update Info
              </Button>
            </Form>
          </CardBody>
        </Card>

        <Card style={{ padding: '28px' }}>
          <CardBody>
            <Form onSubmit={this.updateBio} style={{ marginTop: '24px' }}>
              <h3 style={{ textAlign: 'left', marginBottom: '24px' }}>Update Bio.</h3>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ width: '120px' }}>First name</InputGroupText>
                  </InputGroupAddon>
                  <Input name="first_name" placeholder="eg. Jon" defaultValue={first_name} autoComplete="off" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ width: '120px' }}>Last name</InputGroupText>
                  </InputGroupAddon>
                  <Input name="last_name" placeholder="eg. Snow" defaultValue={last_name} autoComplete="off" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ width: '120px' }}>Title</InputGroupText>
                  </InputGroupAddon>
                  <Input name="title" placeholder="eg. Fullstack Developer" defaultValue={title} autoComplete="off" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ width: '120px' }}>Education</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="education"
                    placeholder="eg. Bachelor of Engineering (Software) UNSW"
                    defaultValue={education}
                    autoComplete="off"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ width: '120px' }}>Location</InputGroupText>
                  </InputGroupAddon>
                  <Input name="location" placeholder="eg. Sydney" defaultValue={location} autoComplete="off" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ width: '120px' }}>Bio</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="textarea"
                    name="summary"
                    placeholder="Eg. I love good coffee, however I am a terrible JavaScript developer."
                    defaultValue={summary}
                  />
                </InputGroup>
              </FormGroup>
              <Button color="primary" style={{ display: 'block', margin: '0 0 0 auto', borderRadius: '100px' }}>
                Update Bio
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default BioEditForm;
