const requests = (state = { fetching: false }, action) => {
    switch(action.type) {
        case 'REQUEST_SESSIONS':
        case 'REQUEST_ADD_SESSION':
        case 'REQUEST_ADD_SEQUENCE':
            return {...state, fetching: true };
        case 'RECEIVE_SESSIONS':
        case 'SESSION_CREATED':
        case 'SEQUENCE_CREATED':
            return {...state, fetching: false};
        default:
            return state;
    }
}

export default requests;
