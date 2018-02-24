let nextSequenceId = 0;
let nextSessionId = 0;

export const addSequence = (name, session) => {
    return {
        type: 'ADD_SEQUENCE',
        id: nextSequenceId++,
        session,
        name
    }
}

export const addSession = name => {
    return {
        type: 'ADD_SESSION',
        id: nextSessionId++,
        name
    }
}
