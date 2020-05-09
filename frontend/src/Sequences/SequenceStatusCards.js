import React from 'react';
import { Table, Label, Icon, Card } from 'semantic-ui-react';
import { INDILight } from '../INDI-Server/INDILight';


const DeviceCardHeader = ({connected, name}) => {
    let labelStyle = connected ? 'green' : 'orange'
    let icon = connected ? 'check' : 'close';
    let connection = connected ? 'connected' : 'not connected';
    return (
        <React.Fragment>
            <Icon name={icon} color={labelStyle} circular style={{float: 'right'}} />
            <Card.Header size="medium">{name}</Card.Header>
            <Card.Meta color={labelStyle}>{connection}</Card.Meta>
        </React.Fragment>
    )

}


export const ExposuresCard = ({exposureJobsCount, totalShots, totalTime, completedShots, completedTime, remainingShots, remainingTime}) => (
    <Card>
        <Card.Content>
                <Icon name='camera' style={{float: 'right'}} />
                <Card.Header size='medium'>Exposures</Card.Header>
                <Card.Meta>{exposureJobsCount} sequences</Card.Meta>
                <Card.Description>
                    <Table definition basic compact='very' size='small' inverted color='grey'>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell content='Total' />
                                <Table.Cell content={totalShots} />
                                <Table.Cell content={<Label content={totalTime} />} />
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell content='Completed' />
                                <Table.Cell content={completedShots} />
                                <Table.Cell content={<Label content={completedTime} />} />
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell content='Remaining' />
                                <Table.Cell content={remainingShots} />
                                <Table.Cell content={<Label content={remainingTime}/> } />
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Card.Description>
        </Card.Content>
    </Card>
)

export const CameraDetailsCard = ({camera, property, value}) => camera? (
    <Card>
        <Card.Content>
            <DeviceCardHeader name={camera.name} connected={camera.connected} />
                <Card.Description>
                    <Label.Group>
                        <Label content='Current exposure: ' basic/>
                        <Label content={value} />
                        {property && <INDILight state={property.state} />}
                    </Label.Group>
                </Card.Description>
        </Card.Content>
    </Card>
) : null;

export const FilterWheelDetailsCard = ({filterWheel, filterNumber, filterName}) => {
    if(!filterWheel)
        return null;
    return (
        <Card>
            <Card.Content>
                   <DeviceCardHeader name={filterWheel.name} connected={filterWheel.connected} />
                    <Card.Description>
                        {filterWheel.connected && (
                            <Label.Group>
                                <Label basic content='Current filter: '/>
                                <Label content={`${filterName} (${filterNumber})`}/>
                            </Label.Group>
                        )}
                    </Card.Description>
            </Card.Content>
        </Card>
    )
}


