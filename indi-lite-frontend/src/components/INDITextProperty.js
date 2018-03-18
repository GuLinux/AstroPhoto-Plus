import React from 'react';
import { Button } from 'react-bootstrap'
import { CommitPendingPropertiesButton, pendingProperty, displayValue } from './INDIPropertyHandlers'

const INDITextProperty = ({property, pendingProperties, addPendingProperties, commitPendingProperties}) => (
    <div className="row">
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-9">
            {property.values.map(value => (
                <div className="row" key={value.name} >
                    <div className="col-xs-2"><p>{value.label}</p></div>
                    <input
                        className="col-xs-10"
                        type="text"
                        name={value.name} 
                        value={displayValue(value, pendingProperties)}
                        onChange={e => addPendingProperties([pendingProperty(property, value, e.target.value)])}
                    />
                </div> 
            ))}
        </div>
        <div className="col-xs-1"><CommitPendingPropertiesButton style="primary" size="xsmall" pendingProperties={pendingProperties} commitPendingProperties={commitPendingProperties} property={property} /></div>
    </div>
)
 
export default INDITextProperty
