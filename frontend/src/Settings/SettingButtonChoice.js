import React from 'react';
import { connect } from 'react-redux'
import { CheckButton } from '../components/CheckButton';
import { Button, Form } from 'semantic-ui-react';
import { update } from './actions';
import { getSettingSelector } from './selectors';

class SettingButtonChoiceComponent extends React.Component {
    renderChoice = ({ value, ...props}, currentValue) => 
        <CheckButton key={value} value={value} active={value === currentValue} onClick={this.update} {...props} />

    render = () => {
        const { size='mini', label, choices, currentValue, update } = this.props;
        return (
            <Form.Group inline>
                <label>{label}</label>
                <Button.Group size={size}>
                    {choices.map(choice => this.renderChoice(choice, currentValue))}
                </Button.Group>
            </Form.Group>
        );
    };

    update = (e, button) => this.props.update({ [this.props.setting]: button.value });
}


export const SettingButtonChoice = connect(getSettingSelector, {update})(SettingButtonChoiceComponent);

