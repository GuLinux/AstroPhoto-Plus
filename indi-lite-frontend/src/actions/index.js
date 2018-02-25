import { fetchSessionsAPI } from '../middleware/api'


let nextSequenceId = 0;
let nextSessionId = 0;

export const addSequence = (name, session) => {
    return {
        type: 'ADD_SEQUENCE',
        id: nextSequenceId++,
        session,
        name
    }
}

export const addSession = name => {
    return {
        type: 'ADD_SESSION',
        id: nextSessionId++,
        name
    }
}

export const requestSessions = function() {
    return {
        type: 'REQUEST_SESSIONS'
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

export const fetchSessions = function() {
    return dispatch => {
        dispatch(requestSessions());
        return fetchSessionsAPI( data => {
            dispatch(receiveSessions(data.entities.sessions, data.result, data.entities.sequences));
        }, error => console.log(error));
    }
}
