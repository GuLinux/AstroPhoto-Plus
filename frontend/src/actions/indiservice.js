import { getINDIServiceAPI, startINDIServiceAPI, stopINDIServiceAPI } from '../middleware/api'
import Actions from './index'

export const INDIService = {
    receivedService: (data) => ({
        type: 'RECEIVED_INDI_SERVICE',
        data
    }),

    fetchService: () => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_SERVICE'});
            return getINDIServiceAPI(dispatch, data => dispatch(INDIService.receivedService(data)));
        }
    },

    serviceStarted: (data) => ({
        type: 'INDI_SERVICE_STARTED',
        ...data
    }),

    serviceExited: (data) => ({
        type: 'INDI_SERVICE_EXITED',
        ...data
    }),

    dismissError: () => ({ type: 'INDI_SERVICE_DISMISS_ERROR' }),

    startService: (devices) => {
        return dispatch => {
            dispatch({type: 'FETCH_START_INDI_SERVICE'});
            return startINDIServiceAPI(dispatch, devices, data => {}, error => {
                if(error.status === 400) {
                    error.json().then(t => dispatch(Actions.Notifications.add('INDI Service', `Error starting INDI Service: ${t.error_message}`, 'error')))
                    dispatch({ type: 'INDI_SERVICE_ERROR_STARTING'})
                    return true;
                }
                return false
            });
        }
    },

    stopService: () => {
        return dispatch => {
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
