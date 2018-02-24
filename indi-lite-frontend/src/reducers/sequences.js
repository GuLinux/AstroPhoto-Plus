
let addSequence = (state, action) => {
    return [
        ...state,
        {
            id: action.id,
            name: action.name,
            session: action.session
        }
    ]
}


const sequences = (state = [], action) => {
    switch(action.type) {
        case 'ADD_SEQUENCE':
            return addSequence(state, action);
        default:
            return state;
    }
}

export default sequences
