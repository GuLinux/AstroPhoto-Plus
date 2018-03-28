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
//        case 'COMMIT_PENDING_PROPERTIES':
            return {...state, fetching: true };
        case 'RECEIVE_SESSIONS':
        case 'SESSION_CREATED':
        case 'SEQUENCE_CREATED':
        case 'RECEIVED_SERVER_STATE':
        case 'RECEIVED_INDI_DEVICES':
        case 'RECEIVED_DEVICE_PROPERTIES':
        case 'SERVER_ERROR':
//        case 'COMMITTED_PENDING_PROPERTIES':
            return {...state, fetching: false};
        default:
            return state;
    }
}

export default requests;
