import React from 'react'
import { Button } from 'react-bootstrap'

const SaveSequenceItem = ({isValid, isChanged, onSave}) => <Button bsStyle="primary" disabled={ ! isValid || ! isChanged } onClick={onSave}>Save</Button>
const BackButton = ({navigateAction, isChanged}) => <Button bsStyle="default" onClick={() => showUnsavedModal(isChanged, navigateAction)}>Back</Button>

const showUnsavedModal = (isChanged, navigateAction) => {
    navigateAction();
}

const SequenceItemButtons = ({isValid, isChanged, onSave, navigateBack, sequenceId, sequenceItem}) => (
    <div>
        <BackButton isChanged={isChanged} navigateAction={() => navigateBack(sequenceId)} />
        <SaveSequenceItem isValid={isValid} isChanged={isChanged} onSave={() => { onSave(sequenceItem); navigateBack(sequenceId)}} />
    </div>
)
export default SequenceItemButtons;
