import React from 'react';
import INDITextProperty from './INDITextProperty';
import INDINumberProperty from './INDINumberProperty';
import INDISwitchProperty from './INDISwitchProperty';
import INDILightProperty from './INDILightProperty';

const getPropertyComponent = property => {
    switch(property.type) {
        case "text":
            return ( <INDITextProperty property={property} /> );
        case "number":
            return ( <INDINumberProperty property={property} /> );
        case "switch":
            return ( <INDISwitchProperty property={property} /> );
        case "light":
            return ( <INDILightProperty property={property} /> );
        default:
            // TODO: render blob in some way?
            return null;
    }
}

const INDIDeviceGroup = ({device, group, properties}) => (
    <div className="container-fluid indi-device-group">
        { properties.map((property, index) => (
            <div className="indi-property" key={index}>{getPropertyComponent(property)}</div>
        ))}
    </div>
)
 
export default INDIDeviceGroup
