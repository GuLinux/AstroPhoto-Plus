const requests = (state = { fetching: false }, action) => {
    switch(action.type) {
        case 'REQUEST_SESSIONS':
        case 'REQUEST_ADD_SESSION':
            return {...state, fetching: true };
        case 'RECEIVE_SESSIONS':
        case 'RECEIVE_NEW_SESSION':
            return {...state, fetching: false};
        default:
            return state;
    }
}

export default requests;
