import React from 'react';
import { connect } from 'react-redux';
import { dismissTimeSyncModal, backendTimeSync } from './actions';
import { timeSyncModalSelector } from './selectors';
import { Button, Modal } from 'semantic-ui-react';

const TimeSyncModalComponent = ({ showTimeSyncModal, dismissTimeSyncModal, backendTimeSync }) => showTimeSyncModal && (
    <Modal open basic>
        <Modal.Header>Time Synchronisation</Modal.Header>
        <Modal.Content>
            <p>Your backend server time seems to be out of sync.</p>
            <p>Do you want to synchronise it?</p>
        </Modal.Content>
        <Modal.Actions>
            <Button onClick={dismissTimeSyncModal}>Cancel</Button>
            <Button onClick={backendTimeSync} primary>Synchronise</Button>
        </Modal.Actions>
    </Modal>
)

export const TimeSyncModal = connect(timeSyncModalSelector, { dismissTimeSyncModal, backendTimeSync })(TimeSyncModalComponent);

