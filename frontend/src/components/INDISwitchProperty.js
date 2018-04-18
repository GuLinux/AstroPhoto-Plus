import React from 'react';
import { Button } from 'react-bootstrap'
import INDILight from './INDILight'

const onButtonClick = (property, value, displayValue, addPendingValues, pendingValues) => {
    if(displayValue)
        return;
    let newPendingValues = { [value.name]: true }
    if(property.rule === 'ONE_OF_MANY') {
        property.values.filter(v => v.name !== value.name).forEach(v => newPendingValues[v.name] = false);
    }
    addPendingValues(newPendingValues, true)
}

const onCheckbox = (property, value, displayValue, addPendingValues, pendingValues) => {
    let newState = ! displayValue;
    addPendingValues({[value.name]: newState}, true)
}

const switchHTMLId = (property, value) => `${property.id}_${value.name}`

const renderSwitch = (property, value, displayValue, isWriteable, pendingValues, addPendingValues) => {
    switch(property.rule) {
        case "ONE_OF_MANY":
        case "AT_MOST_ONE":
            return ( <Button
                        key={value.name}
                        active={displayValue}
                        onClick={e => onButtonClick(property, value, displayValue, addPendingValues, pendingValues)}
                        disabled={!isWriteable}
                        bsSize="xsmall">{value.label}</Button> )
        case "ANY":
            return (
                <span key={value.name} className="col-xs-2">
                    <input
                        type="checkbox"
                        checked={displayValue}
                        name={value.name}
                        id={switchHTMLId(property, value)}
                        readOnly={!isWriteable}
                        onChange={e => onCheckbox(property, value, displayValue, addPendingValues, pendingValues)}
                    />
                    <label htmlFor={switchHTMLId(property, value)}>{value.label}</label>
                </span> )
        default:
            return (<span>Property {value.label} not supported</span>)
    }
}

const INDISwitchProperty = ({property, isWriteable, pendingValues, displayValues, addPendingValues }) => (
    <div className="row">
        <div className="col-xs-1"><INDILight state={property.state} /></div> 
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-9">
            {property.values.map(value => renderSwitch(property, value, displayValues[value.name], isWriteable, pendingValues, addPendingValues))}
        </div>
    </div>
)
 
export default INDISwitchProperty
