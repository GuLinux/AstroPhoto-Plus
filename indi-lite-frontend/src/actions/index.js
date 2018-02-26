import { createSessionAPI, fetchSessionsAPI, createSequenceAPI } from '../middleware/api'

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

export const receivedNewSequence = (sequence, sessionId) => {
    return {
        type: 'RECEIVE_NEW_SEQUENCE',
        session: sessionId,
        sequence
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

export const addSequence = function(name, sessionId) {
    return dispatch => {
        dispatch({type: 'REQUEST_ADD_SEQUENCE'});
        return createSequenceAPI( {name: name, session: sessionId}, data => {
            dispatch(receivedNewSequence(data.entities.sequences[data.result], sessionId));
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

export const navigateToSection = section => {
    return {
        type: 'NAVIGATE_TO_SECTION',
        section
    }
}

export const navigateToSession = (page, session) => {
    return {
        type: 'NAVIGATE_TO_SESSION',
        sessionPage: page,
        sessionId: session
    }
}
