import React, { Component } from 'react';
import axios from 'axios';
import { Card, CardBody, Row, Col } from 'reactstrap';

class ChannelsAll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channels: []
        }
    }

    componentWillMount() {
        axios.get("http://localhost:8080/channels/listall?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1X2lkIjoxLCJlbWFpbCI6InRpbXpoYW5nM0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IjVlODg0ODk4ZGEyODA0NzE1MWQwZTU2ZjhkYzYyOTI3NzM2MDNkMGQ2YWFiYmRkNjJhMTFlZjcyMWQxNTQyZDgiLCJuYW1lX2ZpcnN0IjoiVGltIiwibmFtZV9sYXN0IjoiWmhhbmciLCJwZXJtaXNzaW9uX2lkIjoxLCJwcm9maWxlX2ltZ191cmwiOm51bGx9.SHjAIdFdokIw2TSLWlAiLTN3Khd-_v8sdF-8a-X_wQo")
            .then((res) => {
                console.log(res.data);
                this.setState({
                    channels: res.data.channels
                });
            });
    }

    render() {
        return (
            <div>
                <Row>
                    {this.state.channels.map((channel) => 
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
                    )}
                </Row>
            </div>
        );
    }
}

export default ChannelsAll;
