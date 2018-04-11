import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import ModalContainer from '../containers/ModalContainer'


const UnsavedChangesModal = ({navigateBack, modalName}) => (
    <div>
        <Modal.Header>
            <Modal.Title>Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body><p>If you go back now, your changes will not be saved.</p><p>Do you want to proceed?</p></Modal.Body>
        <Modal.Footer>
            <ModalContainer.Close modal={modalName} bsStyle="primary">Continue editing</ModalContainer.Close>
            <ModalContainer.Close modal={modalName} afterToggle={navigateBack} bsStyle="danger">Close and go back</ModalContainer.Close>
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
            return false;
        }
        return true;
    }

    return (
    <div>
        <ModalContainer.Open bsStyle="default" beforeToggle={onBackClicked} modal="sequenceItemUnsavedChanges">Back</ModalContainer.Open>
        <Button bsStyle="primary" disabled={ ! canSave } onClick={onSaveClicked}>Save</Button>
        <ModalContainer name="sequenceItemUnsavedChanges">
            <UnsavedChangesModal modalName="sequenceItemUnsavedChanges" navigateBack={ () => navigateBack(sequenceId)} />
        </ModalContainer>
    </div>
)}
export default SequenceItemButtons;
