import React, {Component} from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, Card, CardBody } from 'reactstrap';

class RegisterForm extends Component {
    constructor() {
        super();
        this.registerUser = this.registerUser.bind(this);
    }

    registerUser = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        
        const postData = {
            method: 'post',
            url: 'http://localhost:8080/auth/register',
            data: {
                name_first: data.get("name_first"),
                name_last: data.get("name_last"),
                email: data.get("email"),
                password: data.get("password")
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios(postData)
            .then((res) => {
                console.log(res);
                console.log("Successfully registered!");
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        return (
            <Row>
                <Col md={{ size: 8, offset: 2 }}>
                    <Card>
                        <CardBody>
                            <Form onSubmit={this.registerUser}>
                                {/* First Name: */}
                                <FormGroup>
                                    <Label htmlFor="name_first">First Name</Label>
                                    <Input type="text" name="name_first" id="name_first" />
                                </FormGroup>
                                {/* Last Name: */}
                                <FormGroup>
                                    <Label htmlFor="name_last">Last Name</Label>
                                    <Input type="text" name="name_last" id="name_last" />
                                </FormGroup>
                                {/* Email Address: */}
                                <FormGroup>
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" name="email" id="email" />
                                </FormGroup>
                                {/* Password: */}
                                <FormGroup>
                                    <Label htmlFor="password">Password</Label>
                                    <Input type="password" name="password" id="password" />
                                </FormGroup>
                                {/* Submit button: */}
                                <Button>Submit</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );   
    }
}

// class MyForm extends React.Component {
//     constructor() {
//       super();
//       this.handleSubmit = this.handleSubmit.bind(this);
//     }
  
//     handleSubmit(event) {
//       event.preventDefault();
//       const data = new FormData(event.target);
      
//       console.log(data);
//       console.log(data.get("birthdate"));
//     }
  
//     render() {
//       return (
//         <form onSubmit={this.handleSubmit}>
//           <label htmlFor="username">Enter username</label>
//           <input id="username" name="username" type="text" />
  
//           <label htmlFor="email">Enter your email</label>
//           <input id="email" name="email" type="email" />
  
//           <label htmlFor="birthdate">Enter your birth date</label>
//           <input id="birthdate" name="birthdate" type="text" />
  
//           <button>Send data!</button>
//         </form>
//       );
//     }
// }

export default RegisterForm;


/*
import React from 'react';
import PropTypes from 'prop-types';

const ReviewForm = (props, { store }) => {
    // Local variables:
    let _gameTitle, _reviewContent, _imgURL, _rating, _colour;

    const submitReview = (event) => {
        event.preventDefault();
        // Passing the form data up the component tree (to the component where state is managed)
        props.onNewReview(
            _gameTitle.value,
            _reviewContent.value,
            _imgURL.value,
            _rating.value,
            _colour.value
        );
        
        _gameTitle.value = "";
        _reviewContent.value = "";
        _rating.value = "";
        _colour.value = "#000000";
        _imgURL.value = "";
    }

    return (
        <form onSubmit={submitReview}>
            <input ref={(thisElem) => _gameTitle = thisElem}
                type="text"
                placeholder="Game title">       
            </input>
            <input ref={(thisElem) => _reviewContent = thisElem}
                type="text"
                placeholder="Your review">       
            </input>
            <input ref={(thisElem) => _imgURL = thisElem}
                type="text"
                placeholder="Image URL">       
            </input>
            <input ref={(thisElem) => _rating = thisElem}
                type="number"
                placeholder="Your rating">       
            </input>
            <input ref={(thisElem) => _colour = thisElem}
                type="color">       
            </input>
            <button>Submit</button>
        </form>
    );
}

export default ReviewForm;

*/