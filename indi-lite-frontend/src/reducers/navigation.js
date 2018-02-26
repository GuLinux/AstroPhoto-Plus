
const defaultState = {
    section: 'sessions',
    sessionPage: 'sessions',
    sessionId: null
}

const navigation = (state = defaultState, action) => {
    switch(action.type) {
        case 'NAVIGATE_TO_SECTION':
            return {...state, section: action.section};
        case 'NAVIGATE_TO_SESSION':
            return {...state, section: 'sessions', sessionPage: action.sessionPage, sessionId: action.sessionId}
        default:
            return state;
    }
}

export default navigation;

