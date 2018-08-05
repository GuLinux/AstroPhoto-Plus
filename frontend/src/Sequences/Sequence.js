import React from 'react';
import AddSequenceItemModal from '../SequenceItems/AddSequenceItemModal'
import SequenceItemsContainer from '../SequenceItems/SequenceItemsContainer';
import { Table, Label, Container, Header, Card, Icon } from 'semantic-ui-react';
import { canStart } from './model';
import { INDISwitchPropertyContainer } from '../INDI-Server/INDIPropertyContainer';
import INDILight from '../INDI-Server/INDILight';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import PRINTJ from 'printj'
import LastCapturedSequenceImageContainer from './LastCapturedSequenceImageContainer';
import NotFoundPage from '../components/NotFoundPage';
import { secs2time } from '../utils';

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


const ExposuresPage = ({sequenceItems, sequenceItemEntities}) => {
    const exposureSequenceItems = sequenceItems.map(s => sequenceItemEntities[s]).filter(s => s.type === 'shots');
    const remapped = exposureSequenceItems.map(s => ({
        count: s.count,
        shot: s.progress,
        remaining: s.count - s.progress,
        totalTime: s.count * s.exposure,
        elapsed: s.progress * s.exposure,
        timeRemaining: s.exposure * (s.count - s.progress),
    }));
console.log(exposureSequenceItems);
console.log(remapped);
    const computeTotal = (prop) => remapped.reduce( (cur, val) => cur + val[prop], 0);
    return (
        <Card>
            <Card.Content>
                    <Icon name='camera' style={{float: 'right'}} />
                    <Card.Header size='medium'>Exposures</Card.Header>
                    <Card.Meta>{exposureSequenceItems.length} sequences</Card.Meta>
                    <Card.Description>
                        <Table definition basic compact='very'>
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
                                <Label content={PRINTJ.sprintf(camera.exposureProperty.values[0].format, camera.exposureProperty.values[0].value)} />
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

const AddSequenceItem = withRouter( ({history, onCreateSequenceItem, sequenceId, trigger, hasFilterWheel}) => (
    <AddSequenceItemModal trigger={trigger} hasFilterWheel={hasFilterWheel} onAddSequenceItem={(...args) => {
        onCreateSequenceItem(...args);
        history.push('/sequences/' + sequenceId + '/items/pending')
    }} />
))

class Sequence extends React.Component {

    updateMenu = () => {
        const { startSequence, sequence, canEdit, onMount, gear } = this.props;
        if(sequence === null)
            return;
        onMount({
            section: 'Sequences Items',
            navItems: [
                { icon: 'play', onClick: () => startSequence(), disabled: !canStart(sequence, gear), content: 'start' },
                { openModal: AddSequenceItem, modalProps: {
                        onCreateSequenceItem: this.props.onCreateSequenceItem,
                        sequenceId: sequence.id,
                        hasFilterWheel: sequence.filterWheel && sequence.filterWheel !== 'none',
                    },
                    icon: 'add', disabled: !canEdit, content: 'new' },
                { icon: 'arrow left', as: Link, to: "/sequences", content: 'back to sequences' },
            ],
        });
    }

    componentDidMount = () => this.updateMenu();
    componentDidUpdate = () => this.updateMenu();
    componentWillUnmount = () => this.props.onUnmount();


    render = () => {
        const {sequence, camera, filterWheel, canEdit} = this.props;
        if(sequence === null)
            return <NotFoundPage
                        title='Sequence not found'
                        message='The requested sequence was not found on the server. It might have been deleted, or it might not be synchronized yet.'
                        backButtonText='Back to sequences list'
                        backToUrl='/sequences'
                    />;
        return (
        <Container>
            <Header size="medium">{sequence.name}</Header>


            <SequenceItemsContainer canEdit={canEdit} sequenceId={sequence.id} />

            <Header size="medium">Devices</Header>
            <Card.Group>
                <ExposuresPage sequenceItems={sequence.sequenceItems} sequenceItemEntities={sequence.sequenceItemEntities} />
                <CameraDetailsPage camera={camera} />
                <FilterWheelDetailsPage filterWheel={filterWheel} />
            </Card.Group>

            <LastCapturedSequenceImageContainer sequence={sequence.id} />
        </Container>
    )}
}

    

export default Sequence
