import React from 'react';
import INDITextProperty from './INDITextProperty';
import INDINumberProperty from './INDINumberProperty';
import INDISwitchProperty from './INDISwitchProperty';
import INDILightProperty from './INDILightProperty';

const getPropertyComponent = (property, pendingProperties, addPendingProperties, commitPendingProperties) => {
    switch(property.type) {
        case "text":
            return ( <INDITextProperty property={property} pendingProperties={pendingProperties} addPendingProperties={addPendingProperties} commitPendingProperties={commitPendingProperties} /> );
        case "number":
            return ( <INDINumberProperty property={property} pendingProperties={pendingProperties} addPendingProperties={addPendingProperties} commitPendingProperties={commitPendingProperties} /> );
        case "switch":
            return ( <INDISwitchProperty property={property} pendingProperties={pendingProperties} addPendingProperties={addPendingProperties} commitPendingProperties={commitPendingProperties} /> );
        case "light":
            return ( <INDILightProperty property={property} pendingProperties={pendingProperties} addPendingProperties={addPendingProperties} commitPendingProperties={commitPendingProperties} /> );
        default:
            // TODO: render blob in some way?
            return null;
    }
}

const INDIDeviceGroup = ({device, group, properties, pendingProperties, addPendingProperties, commitPendingProperties}) => (
    <div className="container-fluid indi-device-group">
        { properties.map((property, index) => (
            <div className="indi-property" key={index}>{getPropertyComponent(property, pendingProperties.filter(p => p.name === property.name), addPendingProperties, commitPendingProperties)}</div>
        ))}
    </div>
)
 
export default INDIDeviceGroup
