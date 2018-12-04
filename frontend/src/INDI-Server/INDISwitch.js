import React from 'react';
import { Checkbox } from 'semantic-ui-react'
import { CheckButton } from '../components/CheckButton';


const onButtonClick = (property, value, onChange) => {
    if(value.value)
        return;
    const newValues = { [value.name]: true }
    if(property.rule === 'ONE_OF_MANY') {
        property.values.filter(v => v.name !== value.name).forEach(v => newValues[v.name] = false);
    }
    onChange(newValues);
}

const onCheckbox = (property, value, onChange) => {
    let newState = ! value.value;
    onChange({[value.name]: newState});
}


export const INDISwitch = ({property, value, editMode, onChange}) => {
    switch(property.rule) {
        case "ONE_OF_MANY":
        case "AT_MOST_ONE":
            return ( <CheckButton
                        size='mini'
                        key={value.name}
                        active={value.value}
                        onClick={onButtonClick.bind(this, property, value, onChange)}
                        disabled={!editMode}
                        content={value.label} />
                    )
        case "ANY":
            return (
                <Checkbox
                    className='indi-one-of-many-switch'
                    slider
                    checked={value.value}
                    label={value.label}
                    readOnly={!editMode}
                    onChange={onCheckbox.bind(this, property, value, onChange)}
                />
            )
        default:
            return (<span>Property {value.label} not supported</span>)
    }
}

