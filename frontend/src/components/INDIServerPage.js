import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import INDIServerDetailsContainer from '../containers/INDIServerDetailsContainer'
import INDIDeviceContainer from '../containers/INDIDeviceContainer'
import INDIServiceContainer from '../containers/INDIServiceContainer'
import INDIServiceDevicesContainer from '../containers/INDIServiceDevicesContainer'
import INDIServiceProfilesContainer from '../containers/INDIServiceProfilesContainer'


const SETTINGS_PAGE = 'server_status'

const INDISettingsPage = ({hasLocalServer}) => {
    if(! hasLocalServer)
        return (
            <div className="container">
                <div className="col-xs-6 col-xs-offset-3">
                    <h5>Server connection</h5>
                    <INDIServerDetailsContainer />
                </div>
            </div>
    )
    return (
        <div className="container">
            <div className="col-xs-6">
                <INDIServiceProfilesContainer />
                <h5>Available devices</h5>
                <INDIServiceDevicesContainer />
            </div>
            <div className="col-xs-6">
                <h5>Server manager</h5>
                <INDIServiceContainer />

                <h5>Server connection</h5>
                <INDIServerDetailsContainer />
            </div>
        </div>
    )
}

const INDIServerPage = ({devices, indiDeviceTab, navigateToDevice, hasLocalServer}) => (
    <div className="container">
        <Tabs
            id="INDIServerTabs"
            activeKey={indiDeviceTab ? indiDeviceTab : SETTINGS_PAGE}
            onSelect={navigateToDevice}
            bsStyle="tabs"
        >
            <Tab eventKey={SETTINGS_PAGE} title="INDI Server configuration">
                <INDISettingsPage hasLocalServer={hasLocalServer} />
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


