import React from 'react'
import ModalContainer from '../containers/ModalContainer'
import AddSequenceItemModal from './AddSequenceItemModal'
import SequenceItemsContainer from '../containers/SequenceItemsContainer';
import { Button, ButtonGroup } from 'react-bootstrap';
import { canStart } from '../models/sequences'
import { INDINumberPropertyContainer, INDISwitchPropertyContainer } from '../containers/INDIPropertyContainer'
const CameraDetailsPage = ({camera, exposureProperty, exposureAbortProperty}) => {
    if(!camera)
        return null;
    let exposurePropertyComponent = null;
    let exposureAbortPropertyComponent = null;
    if(exposureProperty)
        exposurePropertyComponent = <INDINumberPropertyContainer property={exposureProperty} readOnly={true} />
    if(exposureAbortProperty)
        exposureAbortPropertyComponent = <INDISwitchPropertyContainer property={exposureAbortProperty} />
    return (
        <div className="container">
            <h4>{camera.name}</h4>
            {exposurePropertyComponent}
            {exposureAbortPropertyComponent}
        </div>
    )
}

const Sequence = ({sequence, onCreateSequenceItem, navigateBack, startSequence, camera, exposureProperty, exposureAbortProperty}) => {
    if(sequence === null)
        return null;
    return (
    <div>
        <h2>
            {sequence.name}
            <ButtonGroup className="pull-right">
                <Button onClick={navigateBack} bsSize="small">back</Button>
                <Button onClick={() => startSequence()} bsSize="small" bsStyle="success" disabled={!canStart(sequence)}>start</Button>
                <ModalContainer.Open modal="newSequenceItem" bsStyle="info" bsSize="small" className="pull-right" disabled={!canStart(sequence)}>new</ModalContainer.Open>
            </ButtonGroup>
        </h2>
        <ModalContainer name="newSequenceItem">
            <AddSequenceItemModal modalName="newSequenceItem" onAddSequenceItem={onCreateSequenceItem} />
        </ModalContainer>

        <SequenceItemsContainer sequenceId={sequence.id} />

        <h3>Devices</h3>
        <CameraDetailsPage camera={camera} exposureProperty={exposureProperty} exposureAbortProperty={exposureAbortProperty} />
    </div>
)}


export default Sequence
