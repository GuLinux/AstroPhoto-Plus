const defaultState = { current: {}, pending: {} };


const settingsUpdated = (state, settings) => {
    const pending = {...state.pending };
    Object.keys(settings).forEach(k => delete pending[k]);
    return {
        current: {...state.current, ...settings },
        pending,
    }
}

const settings = (state = defaultState, action) => {
    switch(action.type) {
        case 'SETTINGS_RECEIVED':
            return action.settings ? {...state, current: action.settings } : state;
        case 'SETTINGS_SET_PENDING':
            return {...state, pending: {...state.pending, [action.key]: action.value === state.current[action.key] ? undefined : action.value }};
        case 'SETTINGS_RESET_PENDING':
            return {...state, pending: {...state.pending, [action.key]: undefined }};
        case 'SETTINGS_UPDATED':
            return settingsUpdated(state, action.settings);
        default:
            return state;
    }
}

export default settings;
