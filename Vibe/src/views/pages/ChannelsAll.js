import React, { Component } from 'react';
import axios from 'axios';
import { Card, CardBody, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class ChannelsAll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fetchSucceeded: false,
            channels: []
        }
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        })
        axios.get("http://localhost:8080/channels/listall?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1X2lkIjoxLCJlbWFpbCI6InRpbXpoYW5nM0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IjVlODg0ODk4ZGEyODA0NzE1MWQwZTU2ZjhkYzYyOTI3NzM2MDNkMGQ2YWFiYmRkNjJhMTFlZjcyMWQxNTQyZDgiLCJuYW1lX2ZpcnN0IjoiVGltIiwibmFtZV9sYXN0IjoiWmhhbmciLCJwZXJtaXNzaW9uX2lkIjoxLCJwcm9maWxlX2ltZ191cmwiOm51bGx9.SHjAIdFdokIw2TSLWlAiLTN3Khd-_v8sdF-8a-X_wQo")
            .then((res) => {
                console.log(res.data);
                this.setState({
                    isLoading: false,
                    fetchSucceeded: true,
                    channels: res.data.channels
                });
            })
            .catch((err) => {
                this.setState({
                    isLoading: false,
                    fetchSucceeded: false
                })
            })
        /*
        axios.post("http://localhost:8080/channels/create", {
                token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1X2lkIjoxLCJlbWFpbCI6InRpbXpoYW5nM0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IjVlODg0ODk4ZGEyODA0NzE1MWQwZTU2ZjhkYzYyOTI3NzM2MDNkMGQ2YWFiYmRkNjJhMTFlZjcyMWQxNTQyZDgiLCJuYW1lX2ZpcnN0IjoiVGltIiwibmFtZV9sYXN0IjoiWmhhbmciLCJwZXJtaXNzaW9uX2lkIjoxLCJwcm9maWxlX2ltZ191cmwiOm51bGx9.SHjAIdFdokIw2TSLWlAiLTN3Khd-_v8sdF-8a-X_wQo",
                name: "TVFilthyFrank",
                is_public: "True"
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
        */
    }

    render() {
        return (
            <div>
                <Form>
                    {/* TODO: Token */}
                    <FormGroup>
                        <Label for="name_first">Channel Name</Label>
                        <Input type="text" name="name_first" id="name_first" />
                    </FormGroup>
                    
                    {/* Submit button: */}
                    <Button>Submit</Button>
                </Form>

                {/* TODO: Show a loading message or backdrop */}
                {(this.state.isLoading) ? 
                    <p>Loading all channels...</p> :
                    ""
                }
                {/* If the API call succeeded, show the results */}
                {(this.state.fetchSucceeded) ?
                    <Row>
                        {/* Display all the channels returned by the server OR show a message if there's none  */}
                        {(this.state.channels.length > 0) ? 
                            this.state.channels.map((channel) => 
                                <Col md={3}>
                                    <Card>
                                        <CardBody className="display-flex">
                                            <img
                                                src="https://i.imgur.com/A2Aw6XG.png"
                                                style={{ width: 70, height: 70 }}
                                                alt="Responsive"
                                                aria-hidden={true}
                                            />
                                            <div className="m-l">
                                                <h2 className="h4">{channel.name}</h2>
                                                <p className="text-muted">
                                                    Channel description here. And replace the channel picture
                                                </p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ) :
                            /* No channels exist in the database */
                            "There are currently no channels!" 
                        }
                    </Row> :
                    /* Show an error message if the API failed */
                    "Something went wrong! DevMessenger couldn't fetch the channels :("
                }
                
            </div>
        );
    }
}

export default ChannelsAll;
