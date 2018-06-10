import React from 'react';
import { Menu, Container, Grid, Header } from 'semantic-ui-react';
import INDIServerDetailsContainer from './INDIServerDetailsContainer';
import INDIDeviceContainer from './INDIDeviceContainer';
import INDIServiceContainer from '../INDI-Service/INDIServiceContainer';
import INDIServiceDevicesContainer from '../INDI-Service/INDIServiceDevicesContainer';
import INDIServiceProfilesContainer from '../INDI-Service/INDIServiceProfilesContainer';
import { Route } from 'react-router';
import { NavLink } from 'react-router-dom';

const INDISettingsPage = ({hasLocalServer}) => {
    if(! hasLocalServer)
        return (
            <Container textAlign='center'>
                <Header size='small'>Server connection</Header>
                <INDIServerDetailsContainer />
            </Container>
    )
    return (
        <Container>
            <Grid columns={2}>
                <Grid.Column>
                    <INDIServiceProfilesContainer />
                    <Header size='small'>Available devices</Header>
                    <INDIServiceDevicesContainer />
                </Grid.Column>
                <Grid.Column>
                    <Header size='small'>Server manager</Header>
                    <INDIServiceContainer />

                    <Header size='small'>Server connection</Header>
                    <INDIServerDetailsContainer />
                </Grid.Column>
            </Grid>
        </Container>
    )
}

const INDIServerPage = ({devices, hasLocalServer}) => (
    <Container>
        <Menu>
            <Menu.Item as={NavLink} exact={true} to="/indi">INDI Server</Menu.Item>
            { devices.map( device =>
                <Menu.Item
                    as={NavLink}
                    key={device.id}
                    to={'/indi/' + device.id}
                >
                    {device.name}
                </Menu.Item>
            )}
        </Menu>
        <Route path="/indi" exact={true} render={() => <INDISettingsPage hasLocalServer={hasLocalServer} />} />
        <Route path="/indi/:deviceId" render={({match, location}) => <INDIDeviceContainer location={location} device={match.params.deviceId} />} />
    </Container>
)
export default INDIServerPage;
