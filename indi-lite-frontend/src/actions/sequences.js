import {  createSequenceAPI } from '../middleware/api'

export const Sequences = {
    created: (sequence, sessionId) => {
        return {
            type: 'RECEIVE_NEW_SEQUENCE',
            session: sessionId,
            sequence
        }
    },

    add: (name, sessionId) => {
        return dispatch => {
            dispatch({type: 'REQUEST_ADD_SEQUENCE'});
            return createSequenceAPI( {name: name, session: sessionId}, data => {
                dispatch(Sequences.created(data.entities.sequences[data.result], sessionId));
            }, error => console.log(error));
        }
    }
}

export default Sequences;
