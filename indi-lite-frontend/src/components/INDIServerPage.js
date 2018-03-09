import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import INDIServerDetailsPage from './INDIServerDetailsPage'

const INDIServerPage = ({serverState, setServerConnection}) => (
    <div className="container">
        <Tabs id="INDIServerTabs">
            <Tab eventKey="server_status" title="Server status">
                <INDIServerDetailsPage serverState={serverState} setServerConnection={setServerConnection} />
            </Tab>
            { serverState.devices.map(device => (
                <Tab key={device.name} eventKey={device.name} title={device.name}>
                    {device.name}
                </Tab>
            ))}
        </Tabs>
    </div>
)
export default INDIServerPage;


