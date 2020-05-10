import React, {Component} from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { Button, Form, FormGroup, Label, Input, Col, Row, Card, CardBody } from 'reactstrap';
import { BASE_URL } from '../../constants/api-routes';

class LoginForm extends Component {
  constructor() {
    super();
    this.logInUser = this.logInUser.bind(this);
  }

  logInUser(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const postData = {
      method: 'post',
      url: `${BASE_URL}/auth/login`,
      data: {
        email: data.get("email"),
        password: data.get("password")
      },
      headers: {
        "Content-Type": "application/json"
      }
    };
    axios(postData)
      .then((res) => {
        console.log(res);
        console.log("Successfully logged in");
        // Storing the JWT token inside the browser session storage 
        Cookie.set("token", res.data.token);
        Cookie.set("user_id", res.data.u_id);
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
                <Form onSubmit={this.logInUser}>
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
    )
  }
}

export default LoginForm;