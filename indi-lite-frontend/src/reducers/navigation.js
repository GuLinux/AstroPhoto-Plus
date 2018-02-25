const navigation = (state = { section: 'sessions' }, action) => {
    switch(action.type) {
        case 'NAVIGATE_TO_SECTION':
            return {...state, section: action.section};
        default:
            return state;
    }
}

export default navigation;

