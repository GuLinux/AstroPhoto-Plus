import React from 'react';
import { Table, Label, Icon } from 'semantic-ui-react';
import { INDISwitchPropertyContainer } from '../INDI-Server/INDIPropertyContainer';
import { INDILight } from '../INDI-Server/INDILight';
import { formatDecimalNumber } from '../utils';
import { secs2time } from '../utils';


const DeviceCardHeader = ({device}) => {
    let labelStyle = device.connected ? 'green' : 'orange'
    let icon = device.connected ? 'check' : 'close';
    let connection = device.connected ? 'connected' : 'not connected';
    return (
        <React.Fragment>
            <Icon name={icon} color={labelStyle} circular style={{float: 'right'}} />
            <Card.Header size="medium">{device.name}</Card.Header>
            <Card.Meta color={labelStyle}>{connection}</Card.Meta>
        </React.Fragment>
    )

}


const ExposuresPage = ({sequenceJobs, sequenceJobEntities}) => {
    const exposureSequenceJobs = sequenceJobs.map(s => sequenceJobEntities[s]).filter(s => s.type === 'shots');
    const remapped = exposureSequenceJobs.map(s => ({
        count: s.count,
        shot: s.progress,
        remaining: s.count - s.progress,
        totalTime: s.count * s.exposure,
        elapsed: s.progress * s.exposure,
        timeRemaining: s.exposure * (s.count - s.progress),
    }));
    const computeTotal = (prop) => remapped.reduce( (cur, val) => cur + val[prop], 0);
    return (
        <Card>
            <Card.Content>
                    <Icon name='camera' style={{float: 'right'}} />
                    <Card.Header size='medium'>Exposures</Card.Header>
                    <Card.Meta>{exposureSequenceJobs.length} sequences</Card.Meta>
                    <Card.Description>
                        <Table definition basic compact='very' size='small'>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell content='Total' />
                                    <Table.Cell content={computeTotal('count')} />
                                    <Table.Cell content={<Label content={secs2time(computeTotal('totalTime'))} />} />
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='Completed' />
                                    <Table.Cell content={computeTotal('shot')} />
                                    <Table.Cell content={<Label content={secs2time(computeTotal('elapsed'))} />} />
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell content='Remaining' />
                                    <Table.Cell content={computeTotal('remaining')} />
                                    <Table.Cell content={<Label content={secs2time(computeTotal('timeRemaining')) }/> } />
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Card.Description>
            </Card.Content>
        </Card>
    )

}

const CameraDetailsPage = ({camera}) => {
    if(!camera)
        return null;
    let exposureAbortPropertyComponent = null;
    if(camera.abortExposureProperty)
        exposureAbortPropertyComponent = <INDISwitchPropertyContainer propertyId={camera.abortExposureProperty.id} />
    return (
        <Card>
            <Card.Content>
                   <DeviceCardHeader device={camera} />
                    <Card.Description>
                        <Label.Group>
                            { camera.exposureProperty && (
                            <React.Fragment>
                                <Label content='Current exposure: ' basic/>
                                <Label content={formatDecimalNumber(camera.exposureProperty.values[0].format, camera.exposureProperty.values[0].value)} />
                                <INDILight state={camera.exposureProperty.state } />
                            </React.Fragment>
                            )}
                        </Label.Group>
                    </Card.Description>
            </Card.Content>
            <Card.Content extra> 
                {exposureAbortPropertyComponent}
            </Card.Content>
        </Card>
    )
}

const FilterWheelDetailsPage = ({filterWheel, filterNumber, filterName}) => {
    if(!filterWheel)
        return null;
    return (
        <Card>
            <Card.Content>
                   <DeviceCardHeader device={filterWheel} />
                    <Card.Description>
                        {filterWheel.connected && (
                            <Label.Group>
                                <Label basic content='Current filter: '/>
                                <Label content={`${filterWheel.currentFilter.name} (${filterWheel.currentFilter.number})`}/>
                            </Label.Group>
                        )}
                    </Card.Description>
            </Card.Content>
        </Card>
    )
}


