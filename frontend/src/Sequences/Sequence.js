import React from 'react';
import AddSequenceJobModal from '../SequenceJobs/AddSequenceJobModal'
import SequenceJobsContainer from '../SequenceJobs/SequenceJobsContainer';
import { Table, Label, Container, Header, Card, Icon } from 'semantic-ui-react';
import { INDISwitchPropertyContainer } from '../INDI-Server/INDIPropertyContainer';
import INDILight from '../INDI-Server/INDILight';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { formatDecimalNumber } from '../utils';
import LastCapturedSequenceImageContainer from './LastCapturedSequenceImageContainer';
import NotFoundPage from '../components/NotFoundPage';
import { secs2time } from '../utils';
import { ConfirmDialog } from '../Modals/ModalDialog';

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
        exposureAbortPropertyComponent = <INDISwitchPropertyContainer property={camera.abortExposureProperty} />
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

class Sequence extends React.Component {

    updateMenu = () => {
        const { startSequence, stopSequence, resetSequence, sequence, onMount, gear } = this.props;
        if(sequence === null)
            return;
        onMount({
            section: 'Sequence',
            sectionText: sequence.name,
            navItems: [
                { icon: 'play', onClick: () => startSequence(), disabled: !sequence.canStart(gear), content: 'start' },
                { icon: 'stop', onClick: () => stopSequence(), disabled: !sequence.canStop, content: 'stop' },
                { openModal: ConfirmDialog, modalProps: {
                        content: 'This will reset the status of all jobs in this sequence. Are you sure?',
                        header: 'Confirm sequence reset',
                        cancelButton: 'No',
                        confirmButton: 'Yes',
                        onConfirm: () => resetSequence(sequence),
                        size: 'mini',
                        basic: true,
                        centered: false,
                    },
                    icon: 'redo', disabled: !sequence.canReset, content: 'reset' },
                { icon: 'arrow left', as: Link, to: "/sequences/all", content: 'back to sequences' },

                { openModal: AddSequenceJob, modalProps: {
                        onCreateSequenceJob: this.props.onCreateSequenceJob,
                        sequenceId: sequence.id,
                        hasFilterWheel: sequence.filterWheel && sequence.filterWheel !== 'none',
                    },
                    icon: 'add', disabled: !sequence.canEdit(gear), content: 'new job' },
                { icon: 'arrow left', as: Link, to: "/sequences/all", content: 'back to sequences' },
            ],
        });
    }

    componentDidMount = () => this.updateMenu();
    componentDidUpdate = () => this.updateMenu();
    componentWillUnmount = () => this.props.onUnmount();


    render = () => {
        const {sequence, camera, filterWheel, gear} = this.props;
        if(sequence === null)
            return <NotFoundPage
                        title='Sequence not found'
                        message='The requested sequence was not found on the server. It might have been deleted, or it might not be synchronized yet.'
                        backButtonText='Back to sequences list'
                        backToUrl='/sequences/all'
                    />;
        return (
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
    )}
}

    

export default Sequence
