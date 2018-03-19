import React from 'react';
import { CommitPendingPropertiesButton, pendingProperty, displayValue, canUpdate } from './INDIPropertyHandlers'
import INDILight from './INDILight'


const INDINumberProperty = ({property, pendingProperties, addPendingProperties, commitPendingProperties}) => (
    <div className="row">
        <div className="col-xs-1"><INDILight state={property.state} /></div> 
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-8">
            {property.values.map(value => (
                <div className="row" key={value.name} >
                    <div className="col-xs-2"><p>{value.label}</p></div>
                    <input
                        className="col-xs-10"
                        type="number"
                        min={value.min}
                        max={value.max}
                        step={value.step}
                        name={value.name}
                        value={displayValue(value, pendingProperties)}
                        onChange={e => addPendingProperties([pendingProperty(property, value, parseFloat(e.target.value))])}
                        readOnly={!canUpdate(property)}
                        />
                </div> 
            ))}
        </div>
        <div className="col-xs-1"><CommitPendingPropertiesButton bsStyle="primary" size="xsmall" pendingProperties={pendingProperties} commitPendingProperties={commitPendingProperties} property={property} /></div>
    </div>
)
 
export default INDINumberProperty
