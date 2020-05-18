import React from 'react';
import { Menu, Grid} from 'semantic-ui-react';
import { INDIDeviceGroupContainer } from './INDIDeviceGroupContainer';
import { INDIMessagesPanel } from './INDIMessagesPanel';
import { Route, Redirect } from 'react-router';
import { NavLink } from 'react-router-dom';
import { NotFoundPage } from '../components/NotFoundPage';
import { get } from 'lodash';


export class INDIDevicePage extends React.PureComponent {

    renderGroupContainer = ({match, location}) => <INDIDeviceGroupContainer location={location} deviceId={match.params.deviceId} groupName={match.params.groupName} />;

    renderGroup = (groupId) => {
        const group = this.props.groups.entities[groupId];
        return <Menu.Item key={groupId} as={NavLink} to={`/indi/${this.props.deviceId}/${group.name}`} content={group.name} />;
    }

    renderRedirect = ({match}) => <Redirect to={`/indi/${match.params.deviceId}/Main Control`} />;


    render = () => {
        const {device, messages} = this.props;
        if(! device)
            return <NotFoundPage backToUrl='/indi/server' message='INDI Device not found. Perhaps you need to connect to your INDI server?' backButtonText='INDI server page' />
        return (
            <Grid stackable>
                <Grid.Column width={2}>
                    <Menu secondary vertical fluid>
                        <Menu.Item header content='Groups' />
                        { device.groups.map(this.renderGroup)}
                    </Menu>
                </Grid.Column>
                <Grid.Column width={14}>
                    <Route path="/indi/:deviceId/:groupName" render={this.renderGroupContainer} />
                    <Route path="/indi/:deviceId" exact={true} render={this.renderRedirect} />
                </Grid.Column>
                <INDIMessagesPanel messages={get(messages, device.id, [])} />
            </Grid>
        );
    }
}

