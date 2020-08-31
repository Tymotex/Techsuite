import React from 'react';
import { Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Button } from 'reactstrap';
import Cookie from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../../constants/api-routes';

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

    componentWillMount() {
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
                    this.setState({
                        isLoading: false,
                        fetchSucceeded: false
                    })
                });
        } else {
            // TODO: how should this case be handled?
            alert("TOKEN WAS NOT FOUND IN COOKIE");
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
                .then((res) => {
                    console.log("Successfullly updated bio");
                })
                .catch((err) => {
                    alert(err);
                });
        }
    }

    render() {
        const { first_name, last_name, cover_img_url, birthday, summary, location, title, education} = this.state.bio;
        
        return (
            <Form onSubmit={this.updateBio}>
                <h3>Update your bio:</h3>
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
                        <Input name="education" placeholder="eg. Bachelor of Engineering (Software) UNSW" defaultValue={education}  />
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
                <Button color="primary">Update Bio</Button>
            </Form>
        );
    }
}

export default BioEditForm;
