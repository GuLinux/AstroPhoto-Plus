import { getSettingsApi, updateSettingsApi } from '../middleware/api'
import Actions from '../actions'

const Settings = {

    received: (settings) => ({ type: 'SETTINGS_RECEIVED', settings}),

    fetch: () => {
        return dispatch => {
            dispatch({type: 'REQUEST_SETTINGS'});
            return getSettingsApi( dispatch, data => {
                dispatch(Settings.received(data));
            });
        }
    },
};

export default Settings;

