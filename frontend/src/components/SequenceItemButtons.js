import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import ModalContainer from '../containers/ModalContainer'


const UnsavedChangesModal = ({closeModal, navigateBack}) => (
    <div>
        <Modal.Header>
            <Modal.Title>Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body><p>If you go back now, your changes will not be saved.</p><p>Do you want to proceed?</p></Modal.Body>
        <Modal.Footer>
            <Button onClick={closeModal} bsStyle="primary">Continue editing</Button>
            <Button onClick={() => { closeModal(); navigateBack(); }} bsStyle="danger">Go back</Button>
        </Modal.Footer>
    </div>
)

const SequenceItemButtons = ({isValid, isChanged, onSave, navigateBack, sequenceId, sequenceItem, showSequenceItemUnsavedChangesModal}) => { 
    let onSaveClicked = () => {
        onSave(sequenceItem);
        navigateBack();
    }

    let canSave = isValid && isChanged;

    let onBackClicked = () => {
        if(! isChanged) {
            navigateBack(sequenceId);
            return;
        }
        showSequenceItemUnsavedChangesModal();
    }

    return (
    <div>
        <Button bsStyle="default" onClick={onBackClicked}>Back</Button>
        <Button bsStyle="primary" disabled={ ! canSave } onClick={onSaveClicked}>Save</Button>
        <ModalContainer name="sequenceItemUnsavedChanges">
            <UnsavedChangesModal navigateBack={ () => navigateBack(sequenceId)} />
        </ModalContainer>
    </div>
)}
export default SequenceItemButtons;
