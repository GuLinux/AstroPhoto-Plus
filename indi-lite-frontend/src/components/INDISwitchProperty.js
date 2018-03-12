import React from 'react';
import { Button } from 'react-bootstrap'

const renderSwitch = (property, value) => {
    switch(property.rule) {
        case "ONE_OF_MANY":
            return ( <span key={value.name} className="col-xs-2"><input type="radio" checked={value.value} name={property.name} /> <label htmlFor={value.name}>{value.label}</label></span> )
        case "AT_MOST_ONE":
            return ( <Button key={value.name} active={value.value} bsSize="xsmall">{value.label}</Button> )
        case "ANY":
            return ( <span key={value.name} className="col-xs-2"><input type="checkbox" checked={value.value} name={property.name} /> <label htmlFor={value.name}>{value.label}</label></span> )

    }
}

const INDISwitchProperty = ({property}) => (
    <div className="row">
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-10">
            {property.values.map(value => renderSwitch(property, value))}
        </div>
    </div>
)
 
export default INDISwitchProperty
