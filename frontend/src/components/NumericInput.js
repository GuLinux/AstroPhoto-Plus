import React from 'react';
import { Button, Input } from 'semantic-ui-react'

export class NumericInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { value: null };
    }

    onChange = (e, data) => {
        if(this.valueChangedTimer) {
            clearTimeout(this.valueChangedTimer);
        }
        this.setState({...this.state, value: data.value});
        this.valueChangedTimer = setTimeout( this.mergeState, 900);
        
    }

    mergeState = () => {
        if(! this.props.onChange || this.props.readOnly || this.state.value === null ) {
            return;
        }
        if(this.valueChangedTimer) {
            clearTimeout(this.valueChangedTimer);
            this.valueChangedTimer = null;
        }
        this.setValue(this.state.value);
    }

    setValue = (newValue) => {
        let value = this.props.parse ? this.props.parse(newValue) : parseFloat(newValue) ;
        if(isNaN(value)) {
            value = this.props.value;
        }
        if(this.props.min !== undefined) {
            value = Math.max(value, this.props.min);
        }
        if(this.props.max !== undefined) {
            value = Math.min(value, this.props.max);
        }
        this.props.onChange(value);
        this.setState({...this.state, value: null });
    }

    format = (value) => this.props.format ? this.props.format(value) : value;

    value = () => this.state.value === null ? this.format(this.props.value) : this.state.value;

    step = (direction) => {
        if(! this.props.step) {
            return;
        }
        const newValue = this.props.value + (direction * this.props.step)
        this.setValue(`${newValue}`);
    }

    onKeyUp = (keyEvent) => {
        if(keyEvent.key === 'ArrowUp') {
            this.increaseStep();
        }
        if(keyEvent.key === 'ArrowDown') {
            this.decreaseStep();
        }
    }

    increaseStep = () => this.step(+1);
    decreaseStep = () => this.step(-1);
    render = () => {
        const  { value, format, parse, min, max, step, onChange, action=null, ...args } = this.props;
        return (
            <Input
                onKeyUp={this.onKeyUp}
                onBlur={this.mergeState}
                value={this.value()}
                onChange={this.onChange}
                type='text'
                {...args}
                action={this.renderInputActions(args.readOnly, action)}
            />
        )
    }

    renderInputActions = (readOnly, action) => (
        <React.Fragment>
            <StepButtons
                step={this.props.step}
                readOnly={readOnly}
                increaseStep={this.increaseStep}
                decreaseStep={this.decreaseStep}
            />
            {action}
        </React.Fragment>
    )
}

const StepButtons = ({step, readOnly, increaseStep, decreaseStep}) => {
    if(step <= 0 || readOnly) {
        return null;
    }
    return (
        <Button.Group vertical size='mini' className='number-steps'>
            <Button basic icon='caret up' onClick={increaseStep} />
            <Button basic icon='caret down'onClick={decreaseStep} />
        </Button.Group>
    );
}

