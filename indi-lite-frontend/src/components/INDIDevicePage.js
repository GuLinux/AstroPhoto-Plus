import React from 'react';
import { Row, Tab, Col, Nav, NavItem } from 'react-bootstrap';
import INDIDeviceGroup from './INDIDeviceGroup';

const INDIDevicePage = ({device, groups, properties}) => (
    <Tab.Container id="device_properties">
        <Row>
            <Col xs={2}>
                <Nav bsStyle="pills" stacked>
                    { groups.map( (group, index) => (<NavItem key={index} eventKey={index}>{group.name}</NavItem>) ) }
                </Nav>
            </Col>
            <Col xs={10}>
                <Tab.Content animation>
                { groups.map( (group, index) => (
                    <Tab.Pane key={index} eventKey={index} title={group.name}>
                        <INDIDeviceGroup device={device} group={group} properties={properties.filter(property => property.group === group.name)} />
                    </Tab.Pane>
                ))}
                </Tab.Content>
            </Col>
        </Row>
    </Tab.Container>
)
 
export default INDIDevicePage
