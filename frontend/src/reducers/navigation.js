
const defaultState = {
    section: { key: 'sequences' },
    sequencesPage: { key: 'sequences', sequenceID: null, sequenceItemID: null },
    indi: { device: null, group: null },
}

const navigation = (state = defaultState, action) => {
    switch(action.type) {
        case 'SERVER_ERROR':
            return {...state, section: { key: 'error_page'}};
        case 'NAVIGATE_TO':
            return {...state, [action.navigationKey]: {...state[action.navigationKey], ...action.navigation} };
        default:
            return state;
    }
}

export default navigation;

