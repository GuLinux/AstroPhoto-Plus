import React from 'react';
import { Row, Tab, Col, Nav, NavItem } from 'react-bootstrap';
import INDIDeviceGroup from './INDIDeviceGroup';
import INDIMessagesPanel from './INDIMessagesPanel';

const getGroupActiveKey = (activeTab, groups, defaultTab) => {
    if(groups.filter(g => g.name === activeTab).length === 1)
        return activeTab;
    if(groups.filter(g => g.name === defaultTab).length === 1)
        return defaultTab;
    return null;
}

const INDIDevicePage = ({device, groups, properties, pendingProperties, addPendingProperties, commitPendingProperties, navigateToDeviceGroup, indiGroupTab, messages}) => (
    <Tab.Container id="device_properties" activeKey={getGroupActiveKey(indiGroupTab, groups, 'Main Control')} onSelect={g => navigateToDeviceGroup(device.name, groups[g].name)} >
        <div>
            <Row>
                <Col xs={2}>
                    <Nav bsStyle="pills" stacked>
                        { groups.map( (group, index) => (<NavItem key={index} eventKey={index}>{group.name}</NavItem>) ) }
                    </Nav>
                </Col>
                <Col xs={10}>
                    <Tab.Content animation>
                    { groups.map( (group, index) => (
                        <Tab.Pane key={index} eventKey={group.name} title={group.name}>
                            <INDIDeviceGroup
                                device={device}
                                group={group}
                                properties={properties.filter(property => property.group === group.name)}
                                pendingProperties={pendingProperties.filter(p => p.group === group.name)}
                                addPendingProperties={addPendingProperties}
                                commitPendingProperties={commitPendingProperties}
                            />
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
