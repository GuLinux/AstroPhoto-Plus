import {  updateSequenceItemAPI, createSequenceItemAPI } from '../middleware/api'

export const SequenceItems = {
    newPending: (itemType, sequenceID) => ({
        type: 'NEW_SEQUENCE_ITEM',
        itemType,
        sequenceID,
    }),

    saveSequenceItem: (sequenceItem) => dispatch => {
        dispatch({type: 'REQUEST_SAVE_SEQUENCE_ITEM'});
        if(sequenceItem.id === 'pending')
            return createSequenceItemAPI(dispatch, sequenceItem, data => console.log(data));
        return updateSequenceItemAPI(dispatch, sequenceItem, data => console.log(data));
    },

    created: (sequenceItem, sequenceId) => {
        return {
            type: 'SEQUENCE_ITEM_CREATED',
            sequence: sequenceId,
            sequenceItem
        }
    },

    add: (name, sequenceId) => {
        return dispatch => {
            dispatch({type: 'REQUEST_ADD_SEQUENCE_ITEM'});
            return createSequenceItemAPI(dispatch, {name: name, sequence: sequenceId}, data => {
                dispatch(SequenceItems.created(data.entities.sequenceItems[data.result], sequenceId));
            });
        }
    }
}

export default SequenceItems;
