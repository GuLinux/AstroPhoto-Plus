import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import INDIServerDetailsPage from './INDIServerDetailsPage'
import INDIDevicePage from './INDIDevicePage'

const INDIServerPage = ({serverState, setServerConnection, addPendingProperties}) => (
    <div className="container-fluid">
        <Tabs id="INDIServerTabs">
            <Tab eventKey="server_status" title="Server status">
                <INDIServerDetailsPage serverState={serverState} setServerConnection={setServerConnection} />
            </Tab>
            { serverState.devices.map( (device, index) => (
                <Tab key={index} eventKey={index} title={device.name}>
                    <INDIDevicePage device={device} 
                                    groups={serverState.groups.filter(group => group.device === device.name )}
                                    properties={serverState.properties.filter(property => property.device === device.name)}
                                    pendingProperties={serverState.pendingProperties.filter(p => p.device === device.name)}
                                    addPendingProperties={addPendingProperties}
                     />
                </Tab>
            ))}
        </Tabs>
    </div>
)
export default INDIServerPage;


