import React from 'react';
import ModalContainer from '../Modals/ModalContainer';
import AddSequenceItemModal from '../SequenceItems/AddSequenceItemModal'
import SequenceItemsContainer from '../SequenceItems/SequenceItemsContainer';
import { Button, Label, Container, Header, Grid, Segment } from 'semantic-ui-react';
import { canStart } from './model';
import { INDINumberPropertyContainer, INDISwitchPropertyContainer } from '../INDI-Server/INDIPropertyContainer';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';


// TODO: refactor Gear pages out of this

const DeviceHeader = ({device}) => {
    let labelStyle = device.connected ? 'green' : 'orange'
    let connection = device.connected ? 'connected' : 'not connected';
    return (
        <Segment basic>
            <Header size="medium">{device.name}</Header>
            <Label size='tiny' attached='bottom left' color={labelStyle}>{connection}</Label>
        </Segment>
    )

}

const CameraDetailsPage = ({camera}) => {
    if(!camera)
        return null;
    let exposurePropertyComponent = null;
    let exposureAbortPropertyComponent = null;
    if(camera.exposureProperty)
        exposurePropertyComponent = <INDINumberPropertyContainer property={camera.exposureProperty} readOnly={true} />
    if(camera.abortExposureProperty)
        exposureAbortPropertyComponent = <INDISwitchPropertyContainer property={camera.abortExposureProperty} />
    return (
        <Container>
            <DeviceHeader device={camera} />
            {exposurePropertyComponent}
            {exposureAbortPropertyComponent}
        </Container>
    )
}

const FilterWheelDetailsPage = ({filterWheel, filterNumber, filterName}) => {
    if(!filterWheel)
        return null;
    let currentFilter = null
    if(filterWheel.connected)
        currentFilter = <p>Filter: {filterWheel.currentFilter.name} ({filterWheel.currentFilter.number})</p>
    return (
        <Container>
            <DeviceHeader device={filterWheel} />
            {currentFilter}
        </Container>
    )
}

const AddSequenceItem = withRouter( ({history, onCreateSequenceItem, sequenceId}) => (
    <AddSequenceItemModal onAddSequenceItem={(...args) => {
        onCreateSequenceItem(...args);
        history.push('/sequences/' + sequenceId + '/items/pending')
    }} />
))

const Sequence = ({sequence, onCreateSequenceItem, startSequence, camera, filterWheel, canEdit}) => {
    if(sequence === null)
        return null;
    return (
        <Container>
            <Grid columns={2} padded>
                <Grid.Column verticalAlign="middle">
                    <Header size="large">{sequence.name}</Header>
                </Grid.Column>
                <Grid.Column textAlign="right">
                    <Button.Group>
                        <Button as={Link} size="mini" to="/sequences">back</Button>
                        <Button onClick={() => startSequence()} size="mini" positive disabled={!canStart(sequence)}>start</Button>
                        <ModalContainer.Button.Open modal={AddSequenceItemModal.NAME} color="teal" size="mini" className="pull-right" disabled={!canEdit}>new</ModalContainer.Button.Open>
                    </Button.Group>
                </Grid.Column>
            </Grid>
            <AddSequenceItem onCreateSequenceItem={onCreateSequenceItem} sequenceId={sequence.id} />

            <SequenceItemsContainer canEdit={canEdit} sequenceId={sequence.id} />

            <Header size="medium">Devices</Header>
            <CameraDetailsPage camera={camera} />
            <FilterWheelDetailsPage filterWheel={filterWheel} />
        </Container>
)}


export default Sequence
