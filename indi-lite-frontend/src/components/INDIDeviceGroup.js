import React from 'react';
import { INDITextPropertyContainer, INDINumberPropertyContainer, INDISwitchPropertyContainer, INDILightPropertyContainer } from '../containers/INDIPropertyContainer';

const getPropertyComponent = property => {
    switch(property.type) {
        case "text":
            return ( <INDITextPropertyContainer property={property} /> );
        case "number":
            return ( <INDINumberPropertyContainer property={property} /> );
        case "switch":
            return ( <INDISwitchPropertyContainer property={property} /> );
        case "light":
            return ( <INDILightPropertyContainer property={property} /> );
        default:
            // TODO: render blob in some way?
            return ( <span>Unsupported {property.type} property {property.name}</span> );
    }
}

const INDIDeviceGroup = ({device, group, properties}) => (
    <div className="container-fluid indi-device-group">
        { properties.map(property => (
            <div className="indi-property" key={property.id}>{getPropertyComponent(property)}</div>
        ))}
    </div>
)
 
export default INDIDeviceGroup
