import React from 'react';
import { Input, Label } from 'reactstrap';
import './InputSwitch.scss';

class InputSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: this.props.isActive
        };
        this.toggleSwitch = this.toggleSwitch.bind(this);
    }

    toggleSwitch() {
        this.setState({
            isActive: !this.state.isActive
        });
    }

    render() {
        const { activeText, inactiveText } = this.props;
        const { isActive } = this.state;
        return (
            <label class="switch">
                <Input id="visbilityCheckbox" type="checkbox" name="visibility" defaultChecked={isActive} onChange={this.toggleSwitch} />
                <span class="slider round"></span>
                <Label for="visbilityCheckbox" className="switch-label-text">
                    {(isActive) ? (activeText) : (inactiveText)}
                </Label>
            </label>
        );
    }
}

export default InputSwitch;
