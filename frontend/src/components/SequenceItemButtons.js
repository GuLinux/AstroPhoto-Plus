import React from 'react'
import { Button } from 'react-bootstrap'
import { Dialog, QuestionDialog } from './Dialogs.js'

const SequenceItemButtons = ({isValid, isChanged, onSave, navigateBack, sequenceId, sequenceItem, showSequenceItemUnsavedChangesModal}) => { 
    let onSaveClicked = () => {
        onSave(sequenceItem);
    }

    let canSave = isValid && isChanged;

    let onBackClicked = () => {
        if(! isChanged) {
            navigateBack();
            return false;
        }
        return true;
    }

    return (
    <div>
        <Dialog.Open bsStyle="default" beforeToggle={onBackClicked} modal="sequenceItemUnsavedChanges">Back</Dialog.Open>
        <Button bsStyle="primary" disabled={ ! canSave } onClick={onSaveClicked}>Save</Button>
        <QuestionDialog name="sequenceItemUnsavedChanges" title="Unsaved Changes" buttons={ [{text: 'Continue editing', bsStyle: 'primary'}, {text: 'Close and go back', bsStyle: 'danger', afterClose: navigateBack}] }>
            <p>If you go back now, your changes will not be saved.</p>
            <p>Do you want to proceed?</p>
        </QuestionDialog>
    </div>
)}
export default SequenceItemButtons;
