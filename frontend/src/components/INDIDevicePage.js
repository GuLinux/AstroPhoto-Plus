import React from 'react';
import { Row, Tab, Col, Nav, NavItem } from 'react-bootstrap';
import INDIDeviceGroupContainer from '../containers/INDIDeviceGroupContainer';
import INDIMessagesPanel from './INDIMessagesPanel';
import INDIAutoloadConfiguration from '../containers/INDIAutoloadConfiguration';

const INDIDevicePage = ({device, groups, addPendingProperties, commitPendingProperties, navigateToDeviceGroup, indiGroupTab, messages}) => (
    <Tab.Container id="device" activeKey={indiGroupTab} onSelect={g => navigateToDeviceGroup(device, g)} >
        <div>
            <Row>
                <Nav bsStyle="pills" >
                    { groups.map( group  => (<NavItem key={group} eventKey={group}>{group}</NavItem>) ) }
                </Nav>
                <Tab.Content animation>
                { groups.map( group => (
                    <Tab.Pane key={group} eventKey={group} title={group}>
                        <INDIDeviceGroupContainer device={device} group={group} />
                    </Tab.Pane>
                ))}
                </Tab.Content>
            </Row>
            <Row>
                <Col xs={12}><INDIMessagesPanel messages={messages} /></Col>
            </Row>
            <INDIAutoloadConfiguration device={device} />
        </div>
    </Tab.Container>
)
 
export default INDIDevicePage
