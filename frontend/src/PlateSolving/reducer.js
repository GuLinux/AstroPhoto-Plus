const defaultState = {
    options: {
    },
};

export const plateSolving = (state = defaultState, action) => {
    switch(action.type) {
        case 'PLATESOLVING_SET_OPTION':
            return {...state, options: {...state.options, [action.option]: action.value }};
        default:
        return state;
    }
}