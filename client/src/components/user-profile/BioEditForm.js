import axios from 'axios';
import Cookie from 'js-cookie';
import React from 'react';
import { Button, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';
import { Notification } from '../notification';
import './BioEditForm.scss';

class BioEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            user: {},
            bio: {},
            value: ""
        };
        this.updateBio = this.updateBio.bind(this);
    }

    UNSAFE_componentWillMount() {
        this.setState({
            isLoading: true
        });
        const currUserToken = Cookie.get("token");
        if (currUserToken) {
            // Now fetch the user's bio 
            axios.get(`${BASE_URL}/users/bio?token=${currUserToken}&user_id=${this.props.userID}`)
                .then((userBio) => {
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: true,
                        bio: userBio.data
                    });
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Viewing user bio failed", errorMessage, "danger");
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    })
                });
        } else {
            this.setState({
                isLoading: false,
                fetchSucceeded: false
            });
            Notification.spawnNotification("Failed", "Please log in first", "danger");
        }
    }

    updateBio(event) {
        event.preventDefault();
        console.log("Updating bio");
        const fd = new FormData(event.target);
        
        
        const currUserToken = Cookie.get("token");
        console.log("Token: " + currUserToken);
        console.log("UserID: " + this.props.userID);
        console.log("First name: " + fd.get("first_name"));
        console.log("Last name: " + fd.get("last_name"));

        if (currUserToken) {
            const postData = {
                method: 'post',
                url: `${BASE_URL}/users/bio`,
                data: {
                    token: currUserToken,
                    user_id: this.props.userID,
                    first_name: fd.get("first_name"),
                    last_name: fd.get("last_name"),
                    cover_img_url: fd.get("cover_img_url"),
                    summary: fd.get("summary"),
                    title: fd.get("title"),
                    education: fd.get("education"),
                    location: fd.get("location"),
                },
                headers: { "Content-Type": "application/json" }
            }
            axios(postData)
                .then(() => {
                    console.log("Successfullly updated bio");
                    window.location.reload();
                })
                .catch((err) => {
                    const errorMessage = (err.response.data.message) ? (err.response.data.message) : "Something went wrong";
                    Notification.spawnNotification("Updating bio failed", errorMessage, "danger");
                });
        }
    }

    render() {
        const { first_name, last_name, summary, location, title, education} = this.state.bio;
        
        return (
            <Form onSubmit={this.updateBio}>
                <h3>Update your bio:</h3>
                <div className="title-hr">
                    <hr  />
                </div>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>First name</InputGroupText>
                        </InputGroupAddon>
                        <Input name="first_name" placeholder="eg. Jon" defaultValue={first_name} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>Last name</InputGroupText>
                        </InputGroupAddon>
                        <Input name="last_name" placeholder="eg. Snow" defaultValue={last_name}  />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>Title</InputGroupText>
                        </InputGroupAddon>
                        <Input name="title" placeholder="eg. Fullstack Developer" defaultValue={title}  />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>Education</InputGroupText>
                        </InputGroupAddon>
                        <Input name="education" placeholder="eg. Bachelor of Engineering (Software) UNSW" defaultValue={education} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>Location</InputGroupText>
                        </InputGroupAddon>
                        <Input name="location" placeholder="eg. Sydney" defaultValue={location}  />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>Bio</InputGroupText>
                        </InputGroupAddon>
                        <Input type="textarea" name="summary" placeholder="Eg. I love good coffee, however I am a terrible JavaScript developer." defaultValue={summary} />
                    </InputGroup>
                </FormGroup>
                <Button color="primary">Update Bio</Button>
            </Form>
        );
    }
}

export default BioEditForm;
