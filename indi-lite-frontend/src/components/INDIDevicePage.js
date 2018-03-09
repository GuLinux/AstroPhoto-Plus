import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import INDIDeviceGroup from './INDIDeviceGroup';

const INDIDevicePage = ({device, groups, properties}) => (
    <Tabs id="device_properties">
        { groups.map( (group, index) => (
            <Tab key={index} eventKey={index} title={group.name}>
                <INDIDeviceGroup device={device} group={group} properties={properties.filter(property => property.group === group.name)} />
            </Tab>
        ))}
    </Tabs>
)
 
export default INDIDevicePage
