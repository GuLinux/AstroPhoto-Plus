import { createSessionAPI, fetchSessionsAPI, deleteSessionAPI } from '../middleware/api'
import { Navigation } from './navigation'

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
            type: 'SESSION_CREATED',
            session: sessions[id]
        }
    },

    deleted: (sessions, id) => {
        return {
            type: 'SESSION_DELETED',
            session: sessions[id]
        }
    },



    fetch: () => {
        return dispatch => {
            dispatch({type: 'REQUEST_SESSIONS'});
            return fetchSessionsAPI( dispatch, data => {
                dispatch(Sessions.receive(data.entities.sessions, data.result, data.entities.sequences));
            });
        }
    },

    add: (name, cameraID) => {
        return dispatch => {
            dispatch({type: 'REQUEST_ADD_SESSION'});
            return createSessionAPI( dispatch, {name, camera: cameraID }, data => {
                dispatch(Sessions.created(data.entities.sessions, data.result));
            });
        }
    },
    remove: id => {
        return dispatch => {
            dispatch({type: 'REQUEST_DELETE_SESSION'});
            return deleteSessionAPI( dispatch, id, data => {
                dispatch(Sessions.deleted(data.entities.sessions, data.result));
                dispatch(Navigation.toSession('sessions'));
                dispatch(Sessions.fetch());
            });
        }
    },
}

export default Sessions
