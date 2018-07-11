import { getSettingsApi, updateSettingsApi } from '../middleware/api'

const Settings = {
    setPending: (key, value) => ({ type: 'SETTINGS_SET_PENDING', key, value }),
    resetPending: (key) => ({ type: 'SETTINGS_RESET_PENDING', key }),

    received: (settings) => ({ type: 'SETTINGS_RECEIVED', settings}),
    updated: (settings) => ({ type: 'SETTINGS_UPDATED', settings}),

    fetch: () => {
        return dispatch => {
            dispatch({type: 'REQUEST_SETTINGS'});
            return getSettingsApi( dispatch, data => dispatch(Settings.received(data)) );
        }
    },

    update: (settings) => dispatch => {
        dispatch({ type: 'UPDATE_SETTINGS', settings });
        return updateSettingsApi(dispatch, settings, data => dispatch(Settings.updated(data)) );
    }
};

export default Settings;

