import React from 'react';
import { Menu, Container, Grid, Header } from 'semantic-ui-react';
import INDIServerDetailsContainer from './INDIServerDetailsContainer';
import INDIDeviceContainer from './INDIDeviceContainer';
import INDIServiceContainer from '../INDI-Service/INDIServiceContainer';
import INDIServiceDriversContainer from '../INDI-Service/INDIServiceDriversContainer';
import INDIServiceProfilesContainer from '../INDI-Service/INDIServiceProfilesContainer';
import { Route } from 'react-router';
import { NavLink } from 'react-router-dom';
import { HistoryLandingContainer } from '../Navigation/HistoryLandingContainer';

const INDISettingsPage = ({hasLocalServer}) => {
    if(! hasLocalServer)
        return (
            <Container textAlign='center'>
                <Header size='small'>Server connection</Header>
                <INDIServerDetailsContainer />
            </Container>
    )
    return (
        <Grid celled container stackable>
            <Grid.Column width={10}>
                <INDIServiceProfilesContainer />
                <INDIServiceDriversContainer />
            </Grid.Column>
            <Grid.Column width={6}>
                <Header size='small'>Server manager</Header>
                <INDIServiceContainer />

                <Header size='small'>Server connection</Header>
                <INDIServerDetailsContainer />
            </Grid.Column>
        </Grid>
    )
}

class INDIServerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { lastRoute: 'server' };
    }

    onRouteChange = (newRoute) => this.setState({...this.state, lastRoute: newRoute });

    render = () => (
        <Container>
            <Menu stackable>
                <Menu.Item as={NavLink} exact={true} to="/indi/server">INDI Server</Menu.Item>
                { this.props.devices.map( device =>
                    <Menu.Item
                        as={NavLink}
                        key={device.id}
                        to={'/indi/' + device.id}
                    >
                        {device.name}
                    </Menu.Item>
                )}
            </Menu>
            <HistoryLandingContainer route='/indi' defaultLandingPath='/indi/server'>
                <Route path='/indi/server' exact={true} render={() => <INDISettingsPage hasLocalServer={this.props.hasLocalServer} />} />
                <Route path='/indi/:deviceId' render={({match, location}) => <INDIDeviceContainer location={location} device={match.params.deviceId} />} />
            </HistoryLandingContainer>
            </Container>
    )
}

export default INDIServerPage;
