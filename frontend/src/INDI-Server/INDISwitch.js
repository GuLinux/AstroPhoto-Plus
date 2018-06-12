import React from 'react';
import { Button, Checkbox } from 'semantic-ui-react'


const onButtonClick = (property, value, displayValue, addPendingValues) => {
    if(displayValue)
        return;
    let newPendingValues = { [value.name]: true }
    if(property.rule === 'ONE_OF_MANY') {
        property.values.filter(v => v.name !== value.name).forEach(v => newPendingValues[v.name] = false);
    }
    addPendingValues(newPendingValues, true)
}

const onCheckbox = (property, value, displayValue, addPendingValues) => {
    let newState = ! displayValue;
    addPendingValues({[value.name]: newState}, true)
}


const INDISwitch = ({property, value, displayValue, isWriteable, addPendingValues}) => {
    switch(property.rule) {
        case "ONE_OF_MANY":
        case "AT_MOST_ONE":
            return ( <Button
                        size='mini'
                        key={value.name}
                        active={displayValue}
                        onClick={e => onButtonClick(property, value, displayValue, addPendingValues)}
                        disabled={!isWriteable}
                        content={value.label} />
                    )
        case "ANY":
            return (
                <Checkbox
                    className='indi-one-of-many-switch'
                    slider
                    checked={displayValue}
                    label={value.label}
                    readOnly={!isWriteable}
                    onChange={e => onCheckbox(property, value, displayValue, addPendingValues)}
                />
            )
        default:
            return (<span>Property {value.label} not supported</span>)
    }
}

export default INDISwitch
