import { getINDIServiceAPI, startINDIServiceAPI, stopINDIServiceAPI } from '../middleware/api'

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

    startService: (devices) => {
        return dispatch => {
            dispatch({type: 'FETCH_START_INDI_SERVICE'});
            return startINDIServiceAPI(dispatch, devices, data => console.log(data));
        }
    },

    stopService: () => {
        return dispatch => {
            dispatch({type: 'FETCH_STOP_INDI_SERVICE'});
            return stopINDIServiceAPI(dispatch, data => console.log(data));
        }
    },

    toggleDriver: (name, selected) => ({
        type: 'SELECTED_INDI_DRIVER',
        driver: name,
        selected
    })
}

export default INDIService;
