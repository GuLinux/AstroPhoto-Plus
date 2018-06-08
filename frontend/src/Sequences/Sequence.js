import React from 'react';
import ModalContainer from '../Modals/ModalContainer';
import AddSequenceItemModal from '../SequenceItems/AddSequenceItemModal'
import SequenceItemsContainer from '../SequenceItems/SequenceItemsContainer';
import { Button, ButtonGroup, Label } from 'react-bootstrap';
import { canStart } from './model';
import { INDINumberPropertyContainer, INDISwitchPropertyContainer } from '../INDI-Server/INDIPropertyContainer';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router';


// TODO: refactor Gear pages out of this

const DeviceHeader = ({device}) => {
    let labelStyle = device.connected ? 'success' : 'warning'
    let connection = device.connected ? 'connected' : 'not connected';
    return <h4>{device.name} <span className="device-connection-status"><Label bsStyle={labelStyle}>{connection}</Label></span></h4>
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
        <div className="container">
            <DeviceHeader device={camera} />
            {exposurePropertyComponent}
            {exposureAbortPropertyComponent}
        </div>
    )
}

const FilterWheelDetailsPage = ({filterWheel, filterNumber, filterName}) => {
    if(!filterWheel)
        return null;
    let currentFilter = null
    if(filterWheel.connected)
        currentFilter = <p>Filter: {filterWheel.currentFilter.name} ({filterWheel.currentFilter.number})</p>
    return (<div className="container">
        <DeviceHeader device={filterWheel} />
        {currentFilter}
    </div>)
}

const AddSequenceItem = withRouter( ({history, onCreateSequenceItem, sequenceId}) => (
    <ModalContainer name="newSequenceItem">
        <AddSequenceItemModal modalName="newSequenceItem" onAddSequenceItem={(...args) => {
            onCreateSequenceItem(...args);
            history.push('/sequences/' + sequenceId + '/items/pending')
        }} />
    </ModalContainer>
))

const Sequence = ({sequence, onCreateSequenceItem, startSequence, camera, filterWheel, canEdit}) => {
    if(sequence === null)
        return null;
    return (
    <div>
        <h2>
            {sequence.name}
            <ButtonGroup className="pull-right">
                <LinkContainer to="/sequences">
                    <Button bsSize="small">back</Button>
                </LinkContainer>
                <Button onClick={() => startSequence()} bsSize="small" bsStyle="success" disabled={!canStart(sequence)}>start</Button>
                <ModalContainer.Button.Open modal="newSequenceItem" bsStyle="info" bsSize="small" className="pull-right" disabled={!canEdit}>new</ModalContainer.Button.Open>
            </ButtonGroup>
        </h2>
        <AddSequenceItem onCreateSequenceItem={onCreateSequenceItem} sequenceId={sequence.id} />

        <SequenceItemsContainer canEdit={canEdit} sequenceId={sequence.id} />

        <h3>Devices</h3>
        <CameraDetailsPage camera={camera} />
        <FilterWheelDetailsPage filterWheel={filterWheel} />
    </div>
)}


export default Sequence
