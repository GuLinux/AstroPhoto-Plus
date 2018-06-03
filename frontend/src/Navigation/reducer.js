
const defaultState = {
    section: { key: 'sequences' },
    sequencesPage: { key: 'sequences', sequenceID: null, sequenceItemID: null },
    indi: { device: null, group: null },
    modals: {}
}

const navigation = (state = defaultState, action) => {
    switch(action.type) {
        case 'SERVER_ERROR':
            return {...state, section: { key: 'error_page'}};
        case 'NAVIGATE_TO':
            return {...state, [action.navigationKey]: {...state[action.navigationKey], ...action.navigation} };
        case 'TOGGLE_MODAL':
            return {...state, modals: {...state.modals, [action.name]: action.visible}}
        default:
            return state;
    }
}

export default navigation;

