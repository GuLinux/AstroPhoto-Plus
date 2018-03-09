import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import INDIServerDetailsPage from './INDIServerDetailsPage'
import INDIDevicePage from './INDIDevicePage'

const INDIServerPage = ({serverState, setServerConnection}) => (
    <div className="container">
        <Tabs id="INDIServerTabs">
            <Tab eventKey="server_status" title="Server status">
                <INDIServerDetailsPage serverState={serverState} setServerConnection={setServerConnection} />
            </Tab>
            { serverState.devices.map( (device, index) => (
                <Tab key={index} eventKey={index} title={device.name}>
                    <INDIDevicePage device={device} 
                                    groups={serverState.groups.filter(group => group.device === device.name )}
                                    properties={serverState.properties.filter(property => property.device === device.name)} />
                </Tab>
            ))}
        </Tabs>
    </div>
)
export default INDIServerPage;


