import { createSessionAPI, fetchSessionsAPI } from '../middleware/api'


let nextSequenceId = 0;

export const addSequence = (name, session) => {
    return {
        type: 'ADD_SEQUENCE',
        id: nextSequenceId++,
        session,
        name
    }
}

export const receiveSessions = (sessions, ids, sequences) => {
    return {
        type: 'RECEIVE_SESSIONS',
        sessions,
        ids,
        sequences
    }
}

export const receivedNewSession = (sessions, id) => {
    return {
        type: 'RECEIVE_NEW_SESSION',
        session: sessions[id]
    }
}

export const addSession = function(name) {
    return dispatch => {
        dispatch({type: 'REQUEST_ADD_SESSION'});
        return createSessionAPI( {name: name}, data => {
            dispatch(receivedNewSession(data.entities.sessions, data.result));
        }, error => console.log(error));
    }
}

export const fetchSessions = function() {
    return dispatch => {
        dispatch({type: 'REQUEST_SESSIONS'});
        return fetchSessionsAPI( data => {
            dispatch(receiveSessions(data.entities.sessions, data.result, data.entities.sequences));
        }, error => console.log(error));
    }
}

