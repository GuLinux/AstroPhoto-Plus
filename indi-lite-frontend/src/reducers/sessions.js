
let addSession = (state, action) => {
    return [
        ...state,
        {
            id: action.id,
            name: action.name
        }
    ]
}


const sessions = (state = [], action) => {
    switch(action.type) {
        case 'ADD_SESSION':
            return addSession(state, action);
        default:
            return state;
    }
}

export default sessions
