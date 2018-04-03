
let addSequenceItem = (state, action) => {
    let sequenceItem = action.sequenceItem;
    return {
        ...state,
        [sequenceItem.id]: sequenceItem
    }
}


const sequenceItems = (state = {}, action) => {
    switch(action.type) {
        case 'SEQUENCE_ITEM_CREATED':
            return addSequenceItem(state, action);
        case 'RECEIVE_SEQUENCES':
            return {...state, ...action.sequenceItems};
        default:
            return state;
    }
}

export default sequenceItems
