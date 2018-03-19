import React from 'react';
import { Button } from 'react-bootstrap'
import { pendingProperty, displayValue } from './INDIPropertyHandlers'
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

const renderSwitch = (property, value, pendingProperties, addPendingProperties) => {
    switch(property.rule) {
        case "ONE_OF_MANY":
        case "AT_MOST_ONE":
            return ( <Button
                        key={value.name}
                        active={displayValue(value, pendingProperties)}
                        onClick={e => onButtonClick(property, value, addPendingProperties, pendingProperties)}
                        bsSize="xsmall">{value.label}</Button> )
        case "ANY":
            return (
                <span key={value.name} className="col-xs-2">
                    <input
                        type="checkbox"
                        checked={value.value}
                        name={property.name}
                    />
                    <label htmlFor={value.name}>{value.label}</label>
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
