import React from 'react';
import AddSequenceJobModal from '../SequenceJobs/AddSequenceJobModal'
import SequenceJobsContainer from '../SequenceJobs/SequenceJobsContainer';
import { Menu, Table, Label, Container, Header, Card, Icon } from 'semantic-ui-react';
import { INDISwitchPropertyContainer } from '../INDI-Server/INDIPropertyContainer';
import { INDILight } from '../INDI-Server/INDILight';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { formatDecimalNumber } from '../utils';
import LastCapturedSequenceImageContainer from './LastCapturedSequenceImageContainer';
import { NotFoundPage } from '../components/NotFoundPage';
import { secs2time } from '../utils';
import { ConfirmFlagsDialog } from '../Modals/ModalDialog';
import { NavbarSectionMenu } from '../Navigation/NavbarMenu';
import { Routes } from '../routes';

// TODO: refactor Gear pages out of this

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

const AddSequenceJob = withRouter( ({history, onCreateSequenceJob, sequenceId, trigger, hasFilterWheel}) => (
    <AddSequenceJobModal trigger={trigger} hasFilterWheel={hasFilterWheel} onAddSequenceJob={(...args) => {
        onCreateSequenceJob(...args);
        history.push('/sequences/' + sequenceId + '/items/pending')
    }} />
))


export class SequenceSectionMenu extends React.PureComponent {

    startSequence = () => this.props.startSequence(this.props.sequence);
    stopSequence = () => this.props.stopSequence(this.props.sequence);
    resetSequence = (flags) => this.props.resetSequence(this.props.sequence, flags);
    onCreateSequenceJob = (type) => this.props.onCreateSequenceJob(type, this.props.sequence.id);

    render = () => {
        const { sequence, gear } = this.props;
        return sequence && (
            <NavbarSectionMenu sectionName='Sequence' sectionText={sequence.name}>
                <Menu.Item onClick={this.startSequence} icon='play' content='start' disabled={!sequence.canStart(gear)} />
                <Menu.Item onClick={this.stopSequence} icon='stop' content='stop' disabled={!sequence.canStart(gear)} />
                <ConfirmFlagsDialog
                    content='This will reset the status of all jobs in this sequence. Are you sure?'
                    header='Confim sequence reset'
                    cancelButton='No'
                    confirmButton='Yes'
                    flags={[
                        {
                            name: 'remove_files',
                            label: 'Also remove all fits files',
                        },
                    ]}
                    onConfirm={this.resetSequence}
                    resetState={true}
                    size={'mini'}
                    basic={true}
                    centered={false}
                    trigger={<Menu.Item icon='redo' disabled={!sequence.canReset} content='reset' />}
                />
                <AddSequenceJob
                    onCreateSequenceJob={this.onCreateSequenceJob}
                    sequenceId={sequence.id}
                    hasFilterWheel={sequence.filterWheel && sequence.filterQueel !== 'none'}
                    trigger={<Menu.Item icon='add' disabled={!sequence.canEdit(gear)} content='new job' />}
                />
                <Menu.Item as={Link} to={Routes.SEQUENCES_LIST} content='back to sequences' icon='arrow left' />
            </NavbarSectionMenu>
        )
    }
}

export const Sequence = ({ sequence, camera, filterWheel, gear }) => sequence === null ?
    <NotFoundPage
        title='Sequence not found'
        message='The requested sequence was not found on the server. It might have been deleted, or it might not be synchronized yet.'
        backButtonText='Back to sequences list'
        backToUrl='/sequences/all'
    /> : (
    <Container>
        <Header size="medium">{sequence.name}</Header>


        <SequenceJobsContainer canEdit={sequence.canEdit(gear)} sequenceId={sequence.id} />

        <Card.Group>
            <ExposuresPage sequenceJobs={sequence.sequenceJobs} sequenceJobEntities={sequence.sequenceJobEntities} />
            <CameraDetailsPage camera={camera} />
            <FilterWheelDetailsPage filterWheel={filterWheel} />
        </Card.Group>

        <LastCapturedSequenceImageContainer sequence={sequence.id} />
    </Container>
);

