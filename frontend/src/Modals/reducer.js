const defaultState = {
}

const modals = (state = defaultState, action) => {
    switch(action.type) {
        case 'TOGGLE_MODAL':
            return {...state, [action.name]: action.visible}
        default:
            return state;
    }
}

export default modals;
