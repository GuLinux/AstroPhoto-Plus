import {  createSequenceAPI } from '../middleware/api'

export const Sequences = {
    created: (sequence, sessionId) => {
        return {
            type: 'SEQUENCE_CREATED',
            session: sessionId,
            sequence
        }
    },

    add: (name, sessionId) => {
        return dispatch => {
            dispatch({type: 'REQUEST_ADD_SEQUENCE'});
            return createSequenceAPI(dispatch, {name: name, session: sessionId}, data => {
                dispatch(Sequences.created(data.entities.sequences[data.result], sessionId));
            }, error => console.log(error));
        }
    }
}

export default Sequences;
