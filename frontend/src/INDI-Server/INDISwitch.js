import React from 'react';
import { Checkbox } from 'semantic-ui-react'
import { CheckButton } from '../components/CheckButton';

export class INDISwitch extends React.PureComponent{
    
    componentDidMount = () => this.props.onMount && this.props.onMount(this.props.value);

    onCheckbox = () => {
        let newState = ! this.props.value.value;
        this.props.onChange({[this.props.value.name]: newState});
    }
    
    onButtonClick = () => {
        const { value, onChange } = this.props;
        onChange({ [value.name]: true });
    }

    getDisplayValue = () => this.props.displayValue === undefined ? this.props.value.value : this.props.displayValue;

    render = () => {
        const {property, value, editMode }= this.props;
        switch(property.rule) {
            case "ONE_OF_MANY":
            case "AT_MOST_ONE":
                return ( <CheckButton
                            size='mini'
                            key={value.name}
                            active={this.getDisplayValue()}
                            onClick={this.onButtonClick}
                            disabled={!editMode}
                            content={value.label} />
                        );
            case "ANY":
                return (
                    <Checkbox
                        className='indi-one-of-many-switch'
                        toggle
                        checked={this.getDisplayValue()}
                        label={value.label}
                        readOnly={!editMode}
                        onChange={this.onCheckbox}
                    />
                );
            default:
                return (<span>Property {value.label} not supported</span>);
        }
    }
} 
