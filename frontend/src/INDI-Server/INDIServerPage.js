import React from 'react';
import { Nav } from 'react-bootstrap';
import INDIServerDetailsContainer from './INDIServerDetailsContainer';
import INDIDeviceContainer from './INDIDeviceContainer';
import INDIServiceContainer from '../INDI-Service/INDIServiceContainer';
import INDIServiceDevicesContainer from '../INDI-Service/INDIServiceDevicesContainer';
import INDIServiceProfilesContainer from '../INDI-Service/INDIServiceProfilesContainer';
import { ActiveRoute, NavLinkItem } from '../Navigation/Navigation';
import { Route } from 'react-router';

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

const INDIServerPage = ({devices, hasLocalServer}) => (
    <div className="container">
        <Nav bsStyle="tabs">
            <ActiveRoute exact={true} path="/indi"><NavLinkItem linkRef="/indi" label="INDI Server" /></ActiveRoute>
            { devices.map( device =>
                <ActiveRoute key={device.id} path={'/indi/' + device.id}><NavLinkItem linkRef={'/indi/' + device.id} label={device.name} /></ActiveRoute>
            )}
        </Nav>
        <Route path="/indi" exact={true} render={() => <INDISettingsPage hasLocalServer={hasLocalServer} />} />
        <Route path="/indi/:deviceId" render={({match, location}) => <INDIDeviceContainer location={location} device={match.params.deviceId} />} />
    </div>
)
export default INDIServerPage;
