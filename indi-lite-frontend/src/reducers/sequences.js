
let addSequence = (state, action) => {
    return {
        ...state,
        [action.id]: {
            id: action.id,
            name: action.name
        }
    }
}


const sequences = (state = {}, action) => {
    switch(action.type) {
        case 'ADD_SEQUENCE':
            return addSequence(state, action);
        case 'RECEIVE_SESSIONS':
            return {...state, ...action.sequences};
        default:
            return state;
    }
}

export default sequences
