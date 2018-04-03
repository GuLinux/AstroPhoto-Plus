import {  createSequenceItemAPI } from '../middleware/api'

export const SequenceItems = {
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
