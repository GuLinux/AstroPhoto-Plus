import React from 'react';
import { Menu, Container } from 'semantic-ui-react';
import { INDIDeviceGroupContainer } from './INDIDeviceGroupContainer';
import { INDIMessagesPanel } from './INDIMessagesPanel';
import INDIAutoloadConfiguration from './INDIAutoloadConfiguration';
import { Route, Redirect } from 'react-router';
import { NavLink } from 'react-router-dom';
import { NotFoundPage } from '../components/NotFoundPage';


export class INDIDevicePage extends React.PureComponent {

    renderGroupContainer = ({match, location}) => <INDIDeviceGroupContainer location={location} device={match.params.deviceId} group={match.params.groupName} />;

    render = () => {
        const {device, groups, messages} = this.props;
        if(! device)
            return <NotFoundPage backToUrl='/indi/server' message='INDI Device not found. Perhaps you need to connect to your INDI server?' backButtonText='INDI server page' />
        return (
            <Container>
                <Menu secondary stackable>
                    <Menu.Item header content='Groups' />
                    { groups.map( group => <Menu.Item key={group} as={NavLink} to={`/indi/${device}/${group}`} content={group} /> )}
                </Menu>
                <Route path="/indi/:deviceId/:groupName" render={this.renderGroupContainer} />
                <Route path="/indi/:deviceId" exact={true} render={
                    ({match}) => <Redirect to={`/indi/${match.params.deviceId}/Main Control`} />
                } />
                <INDIMessagesPanel messages={messages} />
                <INDIAutoloadConfiguration device={device} />
            </Container>
        );
    }
}

