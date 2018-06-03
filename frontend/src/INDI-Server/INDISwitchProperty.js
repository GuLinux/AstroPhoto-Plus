import React from 'react';
import INDISwitch from './INDISwitch'
import INDILight from './INDILight'


const INDISwitchProperty = ({property, isWriteable, pendingValues, displayValues, addPendingValues }) => (
    <div className="row">
        <div className="col-xs-1"><INDILight state={property.state} /></div> 
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-9">
            {property.values.map( (value, index) => <INDISwitch key={index} property={property} value={value} displayValue={displayValues[value.name]} isWriteable={isWriteable} addPendingValues={addPendingValues} /> )}
        </div>
    </div>
)
 
export default INDISwitchProperty
