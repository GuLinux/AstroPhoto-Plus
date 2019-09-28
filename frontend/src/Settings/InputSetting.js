import React from 'react';
import { Icon, Form, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux'
import { getSettingSelector } from './selectors';
import { ValueChangedWarning } from './ValueChangedWarning';
import { InputActions } from './InputActions';
import { update } from './actions';
import { DirectoryPicker } from '../components/DirectoryPicker'; 
import { NumericInput } from '../components/NumericInput';


class InputSettingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: this.getCurrentValue() };
    }

    getCurrentValue = () => this.props.currentValue || '';

    componentDidUpdate = (prevProps) => {
        if(this.props.currentValue !== prevProps.currentValue) {
            this.setState({ value: this.getCurrentValue() });
        }
    }

    changedIcon = () => this.state.value !== this.getCurrentValue() ? <Icon name='edit' /> : null;
    changedIconPosition = () => this.state.value !== this.getCurrentValue() ? 'left' : null;

    renderTextInput = () => <Form.Input
        label={this.props.label}
        fluid={this.props.fluid}
        type='text'
        value={this.state.value}
        onChange={this.onTextInputChange}
        action={this.inputActions()}
        icon={this.changedIcon()}
        iconPosition={this.changedIconPosition()}
    />

    renderNumericInput = () => (
        <Form.Field>
            <label>{this.props.label}</label>
            <NumericInput
                label={this.props.labelPrefix}
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                format={this.props.format}
                parse={this.props.parse}
                action={this.inputActions()}
                value={this.state.value}
                onChange={this.onValueChanged}
                fluid={this.props.fluid}
            />
        </Form.Field>
        // TODO: icon not supported for current NumericInput component
    );

    renderInput = () => {
        const { text, path, number } = this.props;
        const activeInputTypes = [text, path, number].filter(i => i).length;
        if(activeInputTypes !== 1) {
            throw('You need to specify one (and only one) prop between `text`, `path` and `number`');
        }
        if(number) {
            return this.renderNumericInput();
        }
        return this.renderTextInput();
    }

    render = () => (
        <React.Fragment>
            {this.renderInput()}
            <ValueChangedWarning currentValue={this.getCurrentValue()} pendingValue={this.state.value} />
        </React.Fragment>
    );

    onTextInputChange = (e, d) => this.onValueChanged(d.value);

    onValueChanged = value => this.setState({ value });

    inputActions = () => <InputActions
        setting={this.props.setting}
        customButtons={this.customInputButtons()}
        currentValue={this.getCurrentValue()}
        pendingValue={this.state.value}
        resetSetting={this.resetSetting}
        updateSetting={this.updateSetting}
    />

    customInputButtons = () => {
        if(this.props.path) {
            return <DirectoryPicker
                        currentDirectory={this.state.value}
                        onSelected={this.onValueChanged}
                        trigger={<Dropdown.Item content='Browse...' icon='folder' />}
            />;
        }
        return null;
    }

    resetSetting = () => this.setState({ value: this.getCurrentValue() });
    updateSetting = () => this.props.update({[this.props.setting]: this.state.value});
}

export const InputSetting = connect(getSettingSelector, {update})(InputSettingComponent);
