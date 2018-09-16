import React from 'react';
import INDISwitch from './INDISwitch'


const INDISwitchProperty = ({property, isWriteable, pendingValues, displayValues, addPendingValues }) => (
    <span>
        {property.values.map( (value, index) =>
            <INDISwitch
                key={index}
                property={property}
                value={value}
                displayValue={displayValues[value.name]}
                editMode={isWriteable} addPendingValues={addPendingValues}
            /> )}
    </span>
)

export default INDISwitchProperty
