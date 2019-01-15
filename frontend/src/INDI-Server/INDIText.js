import React from 'react';
import { Input } from 'semantic-ui-react'

const EditableInput = ({value, onChange, ...args}) => (
    <Input
        type="text"
        className='indi-text'
        value={value}
        onChange={e => onChange(e.target.value)}
        size='small'
        {...args}
    />
)

const CurrentValue = ({value, ...args}) => (
    <Input
        type="text"
        className='indi-text'
        value={value}
        readOnly={true}
        disabled={false}
        size='small'
        {...args}
    />
)

export class INDIText extends React.PureComponent {
    onChange = value => {
        this.props.onChange({[this.props.value.name]: value});
    }

    getDisplayValue = () => this.props.displayValue || this.props.value.value;

    componentDidMount = () => this.props.onMount && this.props.onMount(this.props.value);

    render = () => {
        const {value, editMode}= this.props;
        if(editMode)
            return <EditableInput label={value.label} value={this.getDisplayValue()} onChange={this.onChange} fluid />;
        return <CurrentValue label={value.label} value={value.value} fluid />;
    }
}

