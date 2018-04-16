
let addSequenceItem = (state, action) => {
    let sequenceItem = action.sequenceItem;
    return {
        ...state,
        [sequenceItem.id]: sequenceItem
    }
}

let sequenceItemRemoved = (state, action) => {
    let sequenceItemID = action.sequenceItem.id;
    let newState = {...state};
    delete newState[sequenceItemID];
    return newState;
}


const sequenceItems = (state = {}, action) => {
    switch(action.type) {
        case 'NEW_SEQUENCE_ITEM':
            return {...state, 'pending': { id: 'pending', type: action.itemType, sequence: action.sequenceID }};
        case 'SEQUENCE_ITEM_UPDATED':
            return addSequenceItem(state, action);
        case 'SEQUENCE_ITEM_DELETED':
            return sequenceItemRemoved(state, action)
        case 'RECEIVE_SEQUENCES':
            return {...state, ...action.sequenceItems};
        case 'SEQUENCE_CREATED':
            return {...state, ...action.sequenceItems};
        case 'SEQUENCE_UPDATED':
            return {...state, ...action.data.entities.sequenceItems};
        default:
            return state;
    }
}

export default sequenceItems
