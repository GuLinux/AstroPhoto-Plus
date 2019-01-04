import { getINDIServiceAPI, startINDIServiceAPI, stopINDIServiceAPI, fetchINDIProfilesAPI, addINDIProfileAPI, removeINDIProfileAPI, updateINDIProfileAPI } from '../middleware/api'
import Actions from '../actions'

export const INDIService = {
    receivedService: (data) => ({
        type: 'RECEIVED_INDI_SERVICE',
        data
    }),

    receivedProfiles: data => ({
        type: 'RECEIVED_INDI_PROFILES',
        data
    }),

    selectProfile: id => ({ type: 'SELECTED_INDI_PROFILE', id}),

    addProfile: (name, drivers) => {
        return dispatch => {
            dispatch({type: 'FETCH_ADD_PROFILE'});
            return addINDIProfileAPI(dispatch, {name, drivers}, data => {
                dispatch({type: 'INDI_SERVICE_PROFILE_ADDED', data})
            });
        }
    },

    removeProfile: (id) => {
        return dispatch => {
            dispatch({type: 'FETCH_ADD_PROFILE'});
            return removeINDIProfileAPI(dispatch, id, data => dispatch(INDIService.fetchProfiles()));
        }
    },

    updateProfile: (id, name, drivers) => {
        return dispatch => {
            dispatch({type: 'FETCH_UPDATE_PROFILE'});
            return updateINDIProfileAPI(dispatch, {id, name, drivers}, data => {
                dispatch(INDIService.fetchProfiles())
            })
        }
    },



    fetchService: () => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_SERVICE'});
            return getINDIServiceAPI(dispatch, data => dispatch(INDIService.receivedService(data)));
        }
    },

    fetchProfiles: () => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_PROFILES'});
            return fetchINDIProfilesAPI(dispatch, data => dispatch(INDIService.receivedProfiles(data)));
        }
    },

    serviceStarted: (data) => dispatch => {
        dispatch(Actions.INDIServer.autoconnectServer());
        dispatch({
            type: 'INDI_SERVICE_STARTED',
            ...data
        });
    },

    serviceExited: (data) => dispatch => {
        const notificationMessage = `INDI Service has exited with exit code ${data.payload.exit_code}`;
        dispatch(Actions.Notifications.add('INDI Service exited', notificationMessage , 'warning', 10000))
        dispatch({
            type: 'INDI_SERVICE_EXITED',
            ...data
        });
    },

    dismissError: () => ({ type: 'INDI_SERVICE_DISMISS_ERROR' }),

    startService: (drivers) => {
        return dispatch => {
            dispatch({type: 'FETCH_START_INDI_SERVICE'});
            return startINDIServiceAPI(dispatch, drivers, data => {}, error => {
                if(error.status === 400) {
                    error.json().then(t => dispatch(Actions.Notifications.add('INDI Service', `Error starting INDI Service: ${t.error_message}`, 'error')))
                    dispatch({ type: 'INDI_SERVICE_ERROR_STARTING'})
                    return true;
                }
                return false
            });
        }
    },

    stopService: (disconnect) => {
        return dispatch => {
            disconnect && dispatch(Actions.INDIServer.setServerConnection(false))
            dispatch({type: 'FETCH_STOP_INDI_SERVICE'});
            return stopINDIServiceAPI(dispatch, data => {}, error => {
                if(error.status === 400) {
                    error.json().then(t => dispatch(Actions.Notifications.add('INDI Service', `Error stopping INDI Service: ${t.error_message}`, 'error')))
                    dispatch({ type: 'INDI_SERVICE_ERROR_STOPPING'})
                    return true;
                }
                return false
            });
        }
    },

    toggleDriver: (name, selected) => ({
        type: 'SELECTED_INDI_DRIVER',
        driver: name,
        selected
    })
}

export default INDIService;
