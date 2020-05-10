import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const ChannelForm = () => {
    return (
        <Form>
            {/* TODO: Token */}
            <FormGroup>
                <Label for="name_first">Channel Name</Label>
                <Input type="text" name="name_first" id="name_first" />
            </FormGroup>
            
            {/* Submit button: */}
            <Button>Submit</Button>
        </Form>
    );
}

export default ChannelForm;
