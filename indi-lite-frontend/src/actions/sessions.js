import { createSessionAPI, fetchSessionsAPI } from '../middleware/api'

export const Sessions = {

    receive: (sessions, ids, sequences) => {
        return {
            type: 'RECEIVE_SESSIONS',
            sessions,
            ids,
            sequences
        }
    },

    created: (sessions, id) => {
        return {
            type: 'RECEIVE_NEW_SESSION',
            session: sessions[id]
        }
    },

    fetch: () => {
        return dispatch => {
            dispatch({type: 'REQUEST_SESSIONS'});
            return fetchSessionsAPI( data => {
                dispatch(Sessions.receive(data.entities.sessions, data.result, data.entities.sequences));
            }, error => console.log(error));
        }
    },

    add: name => {
        return dispatch => {
            dispatch({type: 'REQUEST_ADD_SESSION'});
            return createSessionAPI( {name: name}, data => {
                dispatch(Sessions.created(data.entities.sessions, data.result));
            }, error => console.log(error));
        }
    },
}

export default Sessions
