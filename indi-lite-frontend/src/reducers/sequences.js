
let addSequence = (state, action) => {
    let sequence = action.sequence;
    return {
        ...state,
        [sequence.id]: sequence
    }
}


const sequences = (state = {}, action) => {
    switch(action.type) {
        case 'SEQUENCE_CREATED':
            return addSequence(state, action);
        case 'RECEIVE_SESSIONS':
            return {...state, ...action.sequences};
        default:
            return state;
    }
}

export default sequences
