let nextSequenceId = 0;

export const addSequence = name => {
    return {
        type: 'ADD_SEQUENCE',
        id: nextSequenceId++,
        name
    }
}
