import React from 'react';
import { Row, Tab, Col, Nav, NavItem } from 'react-bootstrap';
import INDIDeviceGroupContainer from '../containers/INDIDeviceGroupContainer';
import INDIMessagesPanel from './INDIMessagesPanel';

const INDIDevicePage = ({device, groups, properties, pendingProperties, addPendingProperties, commitPendingProperties, navigateToDeviceGroup, indiGroupTab, messages}) => (
    <Tab.Container id="device" activeKey={indiGroupTab} onSelect={g => navigateToDeviceGroup(device, g)} >
        <div>
            <Row>
                <Col xs={2}>
                    <Nav bsStyle="pills" stacked>
                        { groups.map( group  => (<NavItem key={group} eventKey={group}>{group}</NavItem>) ) }
                    </Nav>
                </Col>
                <Col xs={10}>
                    <Tab.Content animation>
                    { groups.map( group => (
                        <Tab.Pane key={group} eventKey={group} title={group}>
                            <INDIDeviceGroupContainer device={device} group={group} />
                        </Tab.Pane>
                    ))}
                    </Tab.Content>
                </Col>
            </Row>
            <Row>
                <Col xs={12}><INDIMessagesPanel messages={messages} /></Col>
            </Row>
        </div>
    </Tab.Container>
)
 
export default INDIDevicePage
