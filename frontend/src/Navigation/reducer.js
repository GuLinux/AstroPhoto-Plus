const defaultState = {
}

const navigation = (state = defaultState, action) => {
    switch(action.type) {
        case 'NAVBAR_RIGHT_MENU':
            return {...state, rightMenu: action.data};
        default:
            return state;
    }
}

export default navigation;
