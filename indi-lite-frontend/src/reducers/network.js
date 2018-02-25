const requests = (state = { fetching: false }, action) => {
    switch(action.type) {
        case 'REQUEST_SESSIONS':
            return {...state, fetching: true };
        case 'RECEIVE_SESSIONS':
            return {...state, fetching: false};
        default:
            return state;
    }
}

export default requests;
