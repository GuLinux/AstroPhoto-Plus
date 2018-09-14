import React from 'react';
import { Button } from 'semantic-ui-react';
import { ConfirmDialog } from '../Modals/ModalDialog';
import { withRouter } from 'react-router';

const SequenceJobButtons = ({isValid, isChanged, onSave, sequenceJob, history }) => {

    const navigateBack = () => {
        history.push(`/sequences/${sequenceJob.sequence}`)
    };

    let onSaveClicked = () => {
        onSave(sequenceJob, navigateBack);
    }


    let canSave = isValid && isChanged;

    return (
    <React.Fragment>
        { isChanged ?
            <ConfirmDialog
                trigger={<Button content='Back' />}
                header='Unsaved changes'
                cancelButton='Continue editing'
                confirmButton='Close and go back'
                onConfirm={navigateBack}
                size='small'
                basic
                centered={false}
                content={(
                    <React.Fragment>
                        <p>If you go back now, your changes will not be saved.</p>
                        <p>Do you want to proceed?</p>
                    </React.Fragment>
                )}
            />
            : <Button content='Back' onClick={navigateBack} />
        }
        <Button primary disabled={ ! canSave } onClick={onSaveClicked}>Save</Button>
    </React.Fragment>
)}
export default withRouter(SequenceJobButtons);
