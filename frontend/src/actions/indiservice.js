import { getINDIServiceAPI } from '../middleware/api'

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

    toggleDriver: (name, selected) => ({
        type: 'SELECTED_INDI_DRIVER',
        driver: name,
        selected
    })
}

export default INDIService;
