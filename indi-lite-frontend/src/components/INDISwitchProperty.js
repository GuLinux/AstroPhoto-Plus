import React from 'react';
import { Button } from 'react-bootstrap'
import { pendingProperty, displayValue, canUpdate } from './INDIPropertyHandlers'
import INDILight from './INDILight'

const onButtonClick = (property, value, addPendingProperties, pendingProperties) => {
    let checked = displayValue(value, pendingProperties);
    if(checked)
        return;
    let newPendingProperties = [pendingProperty(property, value, true)]
    if(property.rule === 'ONE_OF_MANY') {
        property.values.filter(v => v.name !== value.name).forEach(v => newPendingProperties.push(pendingProperty(property, v, false)));
    }
    addPendingProperties(newPendingProperties, true)
}

const onCheckbox = (property, value, addPendingProperties, pendingProperties) => {
    let checked = displayValue(value, pendingProperties);
    let newState = ! checked;
    addPendingProperties([pendingProperty(property, value, newState)], true)
}

const switchHTMLId = (property, value) => `indi_switch_${property.device}_${property.group}_${property.name}_${value.name}`

const renderSwitch = (property, value, pendingProperties, addPendingProperties) => {
    switch(property.rule) {
        case "ONE_OF_MANY":
        case "AT_MOST_ONE":
            return ( <Button
                        key={value.name}
                        active={displayValue(value, pendingProperties)}
                        onClick={e => onButtonClick(property, value, addPendingProperties, pendingProperties)}
                        disabled={!canUpdate(property)}
                        bsSize="xsmall">{value.label}</Button> )
        case "ANY":
            return (
                <span key={value.name} className="col-xs-2">
                    <input
                        type="checkbox"
                        checked={displayValue(value, pendingProperties)}
                        name={value.name}
                        id={switchHTMLId(property, value)}
                        readOnly={!canUpdate(property)}
                        onChange={e => onCheckbox(property, value, addPendingProperties, pendingProperties)}
                    />
                    <label htmlFor={switchHTMLId(property, value)}>{value.label}</label>
                </span> )
        default:
            return (<span>Property {value.label} not supported</span>)
    }
}

const INDISwitchProperty = ({property, addPendingProperties, pendingProperties }) => (
    <div className="row">
        <div className="col-xs-1"><INDILight state={property.state} /></div> 
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-9">
            {property.values.map(value => renderSwitch(property, value, pendingProperties, addPendingProperties))}
        </div>
    </div>
)
 
export default INDISwitchProperty
