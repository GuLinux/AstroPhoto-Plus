import React from 'react';
import { Label } from 'react-bootstrap'

const bsStyles = {
    IDLE: 'default',
    OK: 'success',
    BUSY: 'warning',
    ALERT: 'danger'
}

const INDILightProperty = ({property}) => (
    <div className="row">
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-10">
            {property.values.map(value => ( <Label key={value.name} bsStyle={bsStyles[value.value]}>{value.label}</Label> ) )}
        </div>
    </div>
)
 
export default INDILightProperty
