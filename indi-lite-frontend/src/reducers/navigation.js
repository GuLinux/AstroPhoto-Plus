
const defaultState = {
    section: 'sessions',
    sessionPage: 'sessions',
    sessionId: null,
    indiDevice: null,
    indiGroup: null,
}

const navigation = (state = defaultState, action) => {
    switch(action.type) {
        case 'NAVIGATE_TO_SECTION':
            return {...state, section: action.section};
        case 'NAVIGATE_TO_SESSION':
            return {...state, section: 'sessions', sessionPage: action.sessionPage, sessionId: action.sessionId}
        case 'NAVIGATE_TO_INDI_DEVICE':
            return {...state, indiDevice: action.device, indiGroup: null}
        case 'NAVIGATE_TO_INDI_GROUP':
            return {...state, indiDevice: action.device, indiGroup: action.group}
        case 'SERVER_ERROR':
            return {...state, section: 'error_page'};
        default:
            return state;
    }
}

export default navigation;

