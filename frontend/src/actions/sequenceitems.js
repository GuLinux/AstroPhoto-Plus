import {  updateSequenceItemAPI, createSequenceItemAPI, deleteSequenceItemAPI } from '../middleware/api'

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
        if(sequenceItem.id === 'pending') {
            delete sequenceItem.id
            return createSequenceItemAPI(dispatch, sequenceItem, (data) => SequenceItems.updated(dispatch, sequenceItem.sequence, data, true) );
        }
        return updateSequenceItemAPI(dispatch, sequenceItem, (data) => SequenceItems.updated(dispatch, sequenceItem.sequence, data) );
    },

    delete: (sequenceItem) => dispatch => {
        dispatch({type: 'REQUEST_DELETE_SEQUENCE_ITEM', sequenceItem});
        return deleteSequenceItemAPI(dispatch, sequenceItem.sequence, sequenceItem.id, (data) => SequenceItems.deleted(dispatch, sequenceItem));
    },

    deleted: (dispatch, sequenceItem) => {
        dispatch({type: 'SEQUENCE_ITEM_DELETED', sequenceItem});
    }
}

export default SequenceItems;
