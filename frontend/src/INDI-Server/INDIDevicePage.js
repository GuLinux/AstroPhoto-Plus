import React from 'react';
import { Menu, Container } from 'semantic-ui-react';
import INDIDeviceGroupContainer from './INDIDeviceGroupContainer';
import INDIMessagesPanel from './INDIMessagesPanel';
import INDIAutoloadConfiguration from './INDIAutoloadConfiguration';
import { Route, Redirect} from 'react-router';
import { NavLink } from 'react-router-dom';



const INDIDevicePage = ({device, groups, addPendingProperties, commitPendingProperties, messages}) => (
    <Container>
        <Menu secondary>
            <Menu.Item header content='Groups' />
            { groups.map( group => <Menu.Item key={group} as={NavLink} to={`/indi/${device}/${group}`} content={group} /> )}
        </Menu>
        <Route path="/indi/:deviceId/:groupName" render={
                ({match, location}) => <INDIDeviceGroupContainer location={location} device={match.params.deviceId} group={match.params.groupName} /> }
        />
        <Route path="/indi/:deviceId" exact={true} render={
            ({match}) => <Redirect to={`/indi/${match.params.deviceId}/Main Control`} />
        } />
        <INDIMessagesPanel messages={messages} />
        <INDIAutoloadConfiguration device={device} />
    </Container>
)

export default INDIDevicePage
