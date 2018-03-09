import React from 'react';
import { Table } from 'react-bootstrap';

const INDIDeviceGroup = ({device, group, properties}) => (
    <div>
        <p>{group.name}</p>
        { properties.map((property, index) => (
            <div key={index}>Property {property.name}</div>
        ))}
    </div>
)
 
export default INDIDeviceGroup
