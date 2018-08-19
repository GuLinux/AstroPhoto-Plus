import { importSequenceAPI, createSequenceAPI, editSequenceAPI, fetchSequencesAPI, deleteSequenceAPI, duplicateSequenceAPI, startSequenceAPI } from '../middleware/api'
import Actions from '../actions'

export const Sequences = {

    receive: (sequences, ids, sequenceItems) => ({
        type: 'RECEIVE_SEQUENCES',
        sequences,
        ids,
        sequenceItems
    }),

    created: (sequences, id, sequenceItems) => ({
        type: 'SEQUENCE_CREATED',
        sequence: sequences[id],
        sequenceItems
    }),

    modified: (sequences, id, sequenceItems) => ({
        type: 'SEQUENCE_MODIFIED',
        sequence: sequences[id],
        sequenceItems
    }),


    deleted: (sequences, id) => ({
            type: 'SEQUENCE_DELETED',
            sequence: sequences[id]
    }),

    updated: (data) => ({
        type: 'SEQUENCE_UPDATED',
        data,
    }),

    started: (sequence, status) => ({ type: 'SEQUENCE_STARTED', status}),


    start: sequence => {
        return dispatch => {
            dispatch({type: 'START_SEQUENCE_REQUESTED'});
            return startSequenceAPI(dispatch, sequence, data => {
                dispatch({type: 'RECEIVED_START_SEQUENCE_REPLY', sequence: { id: sequence.id, status: data.status} });
            }, data => {
                if(data.status === 400) {
                    data.json().then(json => {
                        dispatch(Actions.Notifications.add('Error starting sequence', json.error_message, 'warning'));
                        dispatch({type: 'RECEIVED_START_SEQUENCE_REPLY', sequence: {id: sequence.id, status: 'error'}});
                    });
                    return true;
                }
                return false;
            })
        }
    },

    error: ({sequence, error_message}) => dispatch => {
        dispatch(Actions.Notifications.add('Sequence error', `Error running sequence: ${error_message}`, 'error'));
        return {
            type: 'RUN_SEQUENCE_ERROR',
            sequence,
            message: error_message,
        }
    },

    duplicate: sequence => {
        return dispatch => {
            dispatch({type: 'DUPLICATE_SEQUENCE_REQUESTED', sequence});
            return duplicateSequenceAPI(dispatch, sequence, data => {
                dispatch(Sequences.created(data.entities.sequences, data.result, data.entities.sequenceItems));
            });
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

    edit: (id, name, directory, cameraID, filterWheelID) => {
        return dispatch => {
            const sequence = {id, name, directory, camera: cameraID, filterWheel: filterWheelID };
            dispatch({type: 'REQUEST_EDIT_SEQUENCE', sequence});
            return editSequenceAPI( dispatch, sequence, data => {
                dispatch(Sequences.updated(data));
            });
        }
    },

    add: (name, directory, cameraID, filterWheelID) => {
        return dispatch => {
            dispatch({type: 'REQUEST_ADD_SEQUENCE'});
            return createSequenceAPI( dispatch, {name, directory, camera: cameraID, filterWheel: filterWheelID }, data => {
                dispatch(Sequences.created(data.entities.sequences, data.result, {}));
            });
        }
    },
    import: (sequenceData) => {
        return dispatch => {
            dispatch({type: 'REQUEST_IMPORT_SEQUENCE'});
            return importSequenceAPI( dispatch, sequenceData, data => {
                dispatch(Sequences.created(data.entities.sequences, data.result, data.entities.sequence_items));
            });
        }
    },

    remove: id => {
        return dispatch => {
            dispatch({type: 'REQUEST_DELETE_SEQUENCE'});
            return deleteSequenceAPI( dispatch, id, data => {
                dispatch(Sequences.deleted(data.entities.sequences, data.result));
                dispatch(Sequences.fetch());
            });
        }
    },

    toggleShowLastImage: showLastImage => ({ type: 'SEQUENCE_TOGGLE_SHOW_LAST_IMAGE', showLastImage }),

}

export default Sequences
