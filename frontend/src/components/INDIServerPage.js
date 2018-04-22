import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import INDIServerDetailsContainer from '../containers/INDIServerDetailsContainer'
import INDIDeviceContainer from '../containers/INDIDeviceContainer'


const INDIServerPage = ({devices, indiDeviceTab, navigateToDevice}) => (
    <div className="container">
        <Tabs
            id="INDIServerTabs"
            activeKey={indiDeviceTab ? indiDeviceTab : 'server_status'}
            onSelect={navigateToDevice}
            bsStyle="tabs"
        >
            <Tab eventKey="server_status" title="Server status">
                <INDIServerDetailsContainer />
            </Tab>
            { devices.map( device => (
                <Tab key={device.id} eventKey={device.id} title={device.name}>
                    <INDIDeviceContainer device={device.id} />
                </Tab>
            ))}
        </Tabs>
    </div>
)
export default INDIServerPage;


