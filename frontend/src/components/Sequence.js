import React from 'react'
import ModalContainer from '../containers/ModalContainer'
import AddSequenceItemModal from './AddSequenceItemModal'
import SequenceItemsContainer from '../containers/SequenceItemsContainer';
import { Button, ButtonGroup, Label } from 'react-bootstrap';
import { canStart } from '../models/sequences'
import { INDINumberPropertyContainer, INDISwitchPropertyContainer } from '../containers/INDIPropertyContainer'

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

const Sequence = ({sequence, onCreateSequenceItem, navigateBack, startSequence, camera, filterWheel, canEdit}) => {
    if(sequence === null)
        return null;
    return (
    <div>
        <h2>
            {sequence.name}
            <ButtonGroup className="pull-right">
                <Button onClick={navigateBack} bsSize="small">back</Button>
                <Button onClick={() => startSequence()} bsSize="small" bsStyle="success" disabled={!canStart(sequence)}>start</Button>
                <ModalContainer.Open modal="newSequenceItem" bsStyle="info" bsSize="small" className="pull-right" disabled={!canEdit}>new</ModalContainer.Open>
            </ButtonGroup>
        </h2>
        <ModalContainer name="newSequenceItem">
            <AddSequenceItemModal modalName="newSequenceItem" onAddSequenceItem={onCreateSequenceItem} />
        </ModalContainer>

        <SequenceItemsContainer canEdit={canEdit} sequenceId={sequence.id} />

        <h3>Devices</h3>
        <CameraDetailsPage camera={camera} />
        <FilterWheelDetailsPage filterWheel={filterWheel} />
    </div>
)}


export default Sequence
