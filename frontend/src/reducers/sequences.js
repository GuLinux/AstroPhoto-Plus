
let appendSequence = (state, action) => {
    return { ...state, entities: {...state.entities, [action.sequence.id]: action.sequence}, ids: state.ids.concat(action.sequence.id)};
}

let addSequenceItem = (state, action) => {
    let sequenceId = action.sequence;
    let sequence = state.entities[sequenceId];
    sequence = { ...sequence, sequenceItems: sequence.sequenceItems.concat(action.sequenceItem.id) };
    return {...state, entities: { ...state.entities, [sequenceId]: sequence } }
}

let deleteSequenceItem = (state, action) => {
    let sequence = state.entities[action.sequenceItem.sequence];
    sequence = {...sequence, sequenceItems: sequence.sequenceItems.filter(id => id !== action.sequenceItem.id)}
    return { ...state, entities: {...state.entities, [sequence.id]: sequence} }
}


const sequences = (state = { entities: {}, ids: [] }, action) => {
    switch(action.type) {
        case 'SEQUENCE_CREATED':
            return appendSequence(state, action);
        case 'SEQUENCE_ITEM_CREATED':
            return addSequenceItem(state, action);
        case 'RECEIVE_SEQUENCES':
            return {...state, ids: action.ids, entities: action.sequences};
        case 'SEQUENCE_ITEM_DELETED':
            return deleteSequenceItem(state, action);
        default:
            return state;
    }
}

export default sequences
