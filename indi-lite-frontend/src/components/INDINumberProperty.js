import React from 'react';
import { Button } from 'react-bootstrap'

const INDINumberProperty = ({property}) => (
    <div className="row">
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-9">
            {property.values.map(value => (
                <div className="row" key={value.name} >
                    <div className="col-xs-2"><p>{value.label}</p></div>
                    <input className="col-xs-10" type="number" min={value.min} max={value.max} step={value.step} name={value.name} value={value.value} />
                </div> 
            ))}
        </div>
        <div className="col-xs-1"><Button bsStyle="primary" bsSize="xsmall" disabled>set</Button></div>
    </div>
)
 
export default INDINumberProperty
