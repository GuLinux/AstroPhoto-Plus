import React from 'react';
import { Button } from 'semantic-ui-react';
import { Dialog, QuestionDialog } from '../Modals/Dialogs.js';
import { withRouter } from 'react-router';

const SequenceItemButtons = ({isValid, isChanged, onSave, sequenceItem, history }) => {

    const navigateBack = () => {
        history.push(`/sequences/${sequenceItem.sequence}`)
    };

    let onSaveClicked = () => {
        onSave(sequenceItem, navigateBack);
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
        <Dialog.Button.Open beforeToggle={onBackClicked} modal="sequenceItemUnsavedChanges">Back</Dialog.Button.Open>
        <Button primary disabled={ ! canSave } onClick={onSaveClicked}>Save</Button>
        <QuestionDialog name="sequenceItemUnsavedChanges" title="Unsaved Changes" buttons={ [{text: 'Continue editing', primary: true}, {text: 'Close and go back' , afterClose: navigateBack}] }>
            <p>If you go back now, your changes will not be saved.</p>
            <p>Do you want to proceed?</p>
        </QuestionDialog>
    </div>
)}
export default withRouter(SequenceItemButtons);
