import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import INDIServerDetailsPage from './INDIServerDetailsPage'
import INDIDevicePage from './INDIDevicePage'

const getDeviceActiveKey = (activeTab, devices) => {
    if(devices.filter(d => d.name === activeTab).length === 1)
        return activeTab;
    return 'server_status';
}



const INDIServerPage = ({serverState, setServerConnection, addPendingProperties, commitPendingProperties, indiDeviceTab, indiGroupTab, navigateToDevice, navigateToDeviceGroup }) => (
    <div className="container-fluid">
        <Tabs
            id="INDIServerTabs"
            activeKey={getDeviceActiveKey(indiDeviceTab, serverState.devices)}
            onSelect={navigateToDevice}
        >
            <Tab eventKey="server_status" title="Server status">
                <INDIServerDetailsPage serverState={serverState} setServerConnection={setServerConnection} />
            </Tab>
            { serverState.devices.map( (device, index) => (
                <Tab key={index} eventKey={device.name} title={device.name}>
                    <INDIDevicePage device={device}
                                    groups={serverState.groups.filter(group => group.device === device.name )}
                                    properties={serverState.properties.filter(property => property.device === device.name)}
                                    pendingProperties={serverState.pendingProperties.filter(p => p.device === device.name)}
                                    addPendingProperties={addPendingProperties}
                                    commitPendingProperties={commitPendingProperties}
                                    navigateToDeviceGroup={navigateToDeviceGroup}
                                    indiGroupTab={indiGroupTab}
                                    messages={serverState.messages.filter(m => m.device === device.name)}
                     />
                </Tab>
            ))}
        </Tabs>
    </div>
)
export default INDIServerPage;


