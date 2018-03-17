import React from 'react';
import { Button } from 'react-bootstrap'
import { onChange, displayValue } from './INDIPropertyHandlers'

const onButtonClick = (property, value, addPendingProperty, pendingProperties) => {
    let checked = displayValue(value, pendingProperties);
    if(checked)
        return;
    onChange(property, value, true, addPendingProperty);
    if(property.rule === 'ONE_OF_MANY') {
        property.values.filter(v => v.name !== value.name).forEach(v => onChange(property, v, false, addPendingProperty));
    }
}

const renderSwitch = (property, value, pendingProperties, addPendingProperty) => {
    switch(property.rule) {
        case "ONE_OF_MANY":
        case "AT_MOST_ONE":
            return ( <Button
                        key={value.name}
                        active={displayValue(value, pendingProperties)}
                        onClick={e => onButtonClick(property, value, addPendingProperty, pendingProperties)}
                        bsSize="xsmall">{value.label}</Button> )
        case "ANY":
            return (
                <span key={value.name} className="col-xs-2">
                    <input
                        type="checkbox"
                        checked={value.value}
                        name={property.name}
                        onChange={onChange(property, value)}
                    />
                    <label htmlFor={value.name}>{value.label}</label>
                </span> )
        default:
            return (<span>Property {value.label} not supported</span>)
    }
}

const INDISwitchProperty = ({property, addPendingProperty, pendingProperties }) => (
    <div className="row">
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-10">
            {property.values.map(value => renderSwitch(property, value, pendingProperties, addPendingProperty))}
        </div>
    </div>
)
 
export default INDISwitchProperty
