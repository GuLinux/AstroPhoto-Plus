import { createSequenceAPI, fetchSequencesAPI, deleteSequenceAPI } from '../middleware/api'
import { Navigation } from './navigation'

export const Sequences = {

    receive: (sequences, ids, sequenceItems) => {
        return {
            type: 'RECEIVE_SEQUENCES',
            sequences,
            ids,
            sequenceItems
        }
    },

    created: (sequences, id) => {
        return {
            type: 'SEQUENCE_CREATED',
            sequence: sequences[id]
        }
    },

    deleted: (sequences, id) => {
        return {
            type: 'SEQUENCE_DELETED',
            sequence: sequences[id]
        }
    },



    fetch: () => {
        return dispatch => {
            dispatch({type: 'REQUEST_SEQUENCES'});
            return fetchSequencesAPI( dispatch, data => {
                dispatch(Sequences.receive(data.entities.sequences, data.result, data.entities.sequenceItems));
            });
        }
    },

    add: (name, cameraID) => {
        return dispatch => {
            dispatch({type: 'REQUEST_ADD_SEQUENCE'});
            return createSequenceAPI( dispatch, {name, camera: cameraID }, data => {
                dispatch(Sequences.created(data.entities.sequences, data.result));
            });
        }
    },
    remove: id => {
        return dispatch => {
            dispatch({type: 'REQUEST_DELETE_SEQUENCE'});
            return deleteSequenceAPI( dispatch, id, data => {
                dispatch(Sequences.deleted(data.entities.sequences, data.result));
                dispatch(Navigation.toSequence('sequences'));
                dispatch(Sequences.fetch());
            });
        }
    },
}

export default Sequences
