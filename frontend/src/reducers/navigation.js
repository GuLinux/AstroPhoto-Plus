
const defaultState = {
    section: 'sequences',
    sequencePage: 'sequences',
    sequenceId: null,
    indiDevice: null,
    indiGroup: null,
}

const navigation = (state = defaultState, action) => {
    switch(action.type) {
        case 'NAVIGATE_TO_SECTION':
            return {...state, section: action.section};
        case 'NAVIGATE_TO_SEQUENCE':
            return {...state, section: 'sequences', sequencePage: action.sequencePage, sequenceId: action.sequenceId}
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

