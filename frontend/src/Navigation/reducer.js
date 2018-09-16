const defaultState = {
    landingPaths: {}
}

const navigation = (state = defaultState, action) => {
    switch(action.type) {
        case 'NAVBAR_RIGHT_MENU':
            return {...state, sectionMenu: action.data};
        case 'SET_LANDING_PATH':
            return {...state, landingPaths: {...state.landingPaths, [action.route]: action.path}};
        default:
            return state;
    }
}

export default navigation;
