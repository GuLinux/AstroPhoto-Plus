
let addSession = (state, action) => {
    let session = {
        id: action.id,
        name: action.name,
        sequences: []
    };

    return {
        entities: {...state.entities, [session.id]: session},
        ids: state.ids.concat(session.id)
    }
}

let addSequence = (state, action) => {
    let sessionId = action.session;
    let session = state.entities[sessionId];
    session = { ...session, sequences: session.sequences.concat(action.id) };
    return {
        ...state,
        entities: {
            ...state.entities,
            [sessionId]: {
                ...session,
            }
        }
    }
}


const sessions = (state = { entities: {}, ids: [] }, action) => {
    switch(action.type) {
        case 'ADD_SESSION':
            return addSession(state, action);
        case 'ADD_SEQUENCE':
            return addSequence(state, action);
        case 'RECEIVE_SESSIONS':
            return {...state, ids: action.ids, entities: action.sessions};
        default:
            return state;
    }
}

export default sessions
