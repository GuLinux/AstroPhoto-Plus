const requests = (state = { fetching: false }, action) => {
    switch(action.type) {
        case 'REQUEST_SESSIONS':
        case 'REQUEST_ADD_SESSION':
        case 'REQUEST_ADD_SEQUENCE':
        case 'FETCH_INDI_DEVICE_PROPERTIES':
        case 'FETCH_INDI_DEVICES':
        case 'FETCH_INDI_SERVER_STATE':
        case 'CONNECT_INDI_SERVER':
        case 'DISCONNECT_INDI_SERVER':
        case 'FETCH_CAMERAS':
        case 'DUPLICATE_SEQUENCE_REQUESTED':
        case 'START_SEQUENCE_REQUESTED':
        case 'REQUEST_SEQUENCE_ITEM_MOVE':
//        case 'COMMIT_PENDING_PROPERTIES':
            return {...state, fetching: true };
        case 'RECEIVE_SESSIONS':
        case 'SESSION_CREATED':
        case 'SEQUENCE_CREATED':
        case 'RECEIVED_SERVER_STATE':
        case 'RECEIVED_INDI_DEVICES':
        case 'RECEIVED_DEVICE_PROPERTIES':
        case 'SERVER_ERROR':
        case 'RECEIVED_CAMERAS':
        case 'RECEIVED_START_SEQUENCE_REPLY':
        case 'RESPONSE_ERROR':
        case 'SEQUENCE_ITEM_UPDATED':
        case 'SEQUENCE_UPDATED':
//        case 'COMMITTED_PENDING_PROPERTIES':
            return {...state, fetching: false};
        default:
            return state;
    }
}

export default requests;
