import React from 'react';
import INDITextProperty from './INDITextProperty';

const getPropertyComponent = property => {
    switch(property.type) {
        case "text":
            return ( <INDITextProperty property={property} /> );
        default:
            return ( <p>{property.type} property: {property.name}</p> );
            // return null;
    }
}

const INDIDeviceGroup = ({device, group, properties}) => (
    <div className="container">
        <p>{group.name}</p>
        { properties.map((property, index) => (
            <div key={index}>{getPropertyComponent(property)}</div>
        ))}
    </div>
)
 
export default INDIDeviceGroup
