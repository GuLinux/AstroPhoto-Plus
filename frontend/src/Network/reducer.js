export const network = (state = { fetching: false }, action) => {
    switch (action.type) {
        case 'REQUEST_SESSIONS':
        case 'REQUEST_ADD_SESSION':
        case 'REQUEST_ADD_SEQUENCE':
        case 'FETCH_INDI_DEVICES':
        case 'FETCH_INDI_SERVER_STATE':
        case 'CONNECT_INDI_SERVER':
        case 'DISCONNECT_INDI_SERVER':
        case 'DUPLICATE_SEQUENCE_REQUESTED':
        case 'START_SEQUENCE_REQUESTED':
        case 'REQUEST_SEQUENCE_ITEM_MOVE':
        case 'REQUEST_SEQUENCE_ITEM_DUPLICATE':
        case 'REQUEST_SAVE_SEQUENCE_ITEM':
        case 'FETCH_INDI_SERVICE':
        case 'UPDATE_SETTINGS':
        case 'RESET_SEQUENCE_REQUESTED':
            //        case 'COMMIT_PENDING_PROPERTIES':
            return { ...state, fetching: true };
        case 'RECEIVE_SESSIONS':
        case 'SESSION_CREATED':
        case 'SEQUENCE_CREATED':
        case 'RECEIVED_SERVER_STATE':
        case 'RECEIVED_INDI_DEVICES':
        case 'SERVER_ERROR':
        case 'RECEIVED_CAMERAS':
        case 'RECEIVED_START_SEQUENCE_REPLY':
        case 'RESPONSE_ERROR':
        case 'SEQUENCE_ITEM_UPDATED':
        case 'SEQUENCE_UPDATED':
        case 'REQUEST_SAVE_SEQUENCE_ITEM_ERROR':
        case 'RECEIVED_INDI_SERVICE':
        case 'RECEIVED_RESET_SEQUENCE_REPLY':
        case 'SETTINGS_UPDATED':
            //        case 'COMMITTED_PENDING_PROPERTIES':
            return { ...state, fetching: false };
        default:
            return state;
    }
}


