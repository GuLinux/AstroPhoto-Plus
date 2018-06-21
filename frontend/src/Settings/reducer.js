
const settings = (state = {}, action) => {
    switch(action.type) {
        case 'SETTINGS_RECEIVED':
            return action.settings ? action.settings : {};
        default:
            return state;
    }
}

export default settings;
