import React from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import INDIDeviceGroupContainer from './INDIDeviceGroupContainer';
import INDIMessagesPanel from './INDIMessagesPanel';
import INDIAutoloadConfiguration from './INDIAutoloadConfiguration';
import { ActiveRoute, NavLinkItem } from '../Navigation/Navigation';
import { Route, Redirect} from 'react-router';


const INDIDevicePage = ({device, groups, addPendingProperties, commitPendingProperties, messages}) => (
    <div>
        <Row>
            <Nav bsStyle="pills">
                { groups.map( group => {
                    let path = `/indi/${device}/${group}`;
                    return <ActiveRoute key={group} path={path}><NavLinkItem linkRef={path} label={group} /></ActiveRoute>
                }
                )}
            </Nav>
            <Route path="/indi/:deviceId/:groupName" render={
                ({match, location}) => <INDIDeviceGroupContainer location={location} device={match.params.deviceId} group={match.params.groupName} /> }
            />
            <Route path="/indi/:deviceId" exact={true} render={
                ({match}) => <Redirect to={`/indi/${match.params.deviceId}/Main Control`} />
            } />
        </Row>
        <Row>
            <Col xs={12}><INDIMessagesPanel messages={messages} /></Col>
        </Row>
        <INDIAutoloadConfiguration device={device} />
    </div>
)

export default INDIDevicePage
