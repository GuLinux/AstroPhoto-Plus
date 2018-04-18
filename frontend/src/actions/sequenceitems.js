import {  moveSequenceItemAPI, updateSequenceItemAPI, createSequenceItemAPI, deleteSequenceItemAPI } from '../middleware/api'
import Actions from './index'

export const SequenceItems = {
    newPending: (itemType, sequenceID) => ({
        type: 'NEW_SEQUENCE_ITEM',
        itemType,
        sequenceID,
    }),

    updated: (dispatch, sequence, data, wasNew) => {
        let sequenceItem = {...data.entities.sequenceItems[data.result], sequence};
        dispatch({ type: 'SEQUENCE_ITEM_UPDATED', sequenceItem})
        if(wasNew) {
            dispatch({type: 'SEQUENCE_ITEM_REMOVED', id: 'pending', sequence})
            dispatch({type: 'SEQUENCE_ITEM_CREATED', sequenceItem, sequence})
        }
    },

    saveSequenceItem: (sequenceItem) => dispatch => {
        dispatch({type: 'REQUEST_SAVE_SEQUENCE_ITEM', sequenceItem});

        let onError = response => {
            if(response.status == 400) {
                response.json().then(data => dispatch(Actions.Notifications.add('Error saving sequence item', data.error_message, 'warning')) );
                return true;
            } 
            return false;
        } 

        let onSuccess = (data, wasCreated) => {
            SequenceItems.updated(dispatch, sequenceItem.sequence, data, wasCreated)
            dispatch(Actions.Navigation.toSequence('sequence', sequenceItem.sequence))
        }

        if(sequenceItem.id === 'pending') {
            delete sequenceItem.id
            return createSequenceItemAPI(dispatch, sequenceItem, (data) => onSuccess(data, true) , onError);
        }
        return updateSequenceItemAPI(dispatch, sequenceItem, data => onSuccess(data, false), onError );
    },

    delete: (sequenceItem) => dispatch => {
        dispatch({type: 'REQUEST_DELETE_SEQUENCE_ITEM', sequenceItem});
        return deleteSequenceItemAPI(dispatch, sequenceItem.sequence, sequenceItem.id, (data) => SequenceItems.deleted(dispatch, sequenceItem));
    },

    deleted: (dispatch, sequenceItem) => {
        dispatch({type: 'SEQUENCE_ITEM_DELETED', sequenceItem});
    },

    move: (sequenceItem, direction) => dispatch => {
        dispatch({type: 'REQUEST_SEQUENCE_ITEM_MOVE', sequenceItem, direction});
        return moveSequenceItemAPI(dispatch, sequenceItem, direction, (data) => dispatch(Actions.Sequences.updated(data)));
    },

}

export default SequenceItems;
