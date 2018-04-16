import { getCamerasAPI, getFilterWheelsAPI } from '../middleware/api'

const Gear = {
    fetchCameras: () => {
        return dispatch => {
            dispatch({type: 'FETCH_CAMERAS'});
            return getCamerasAPI(dispatch, data => dispatch(Gear.receivedCameras(data)));
        }
    },

    receivedCameras: cameras => {
        return { type: 'RECEIVED_CAMERAS', cameras };
    },

    fetchFilterWheels: () => {
        return dispatch => {
            dispatch({type: 'FETCH_FILTER_WHEELS'});
            return getFilterWheelsAPI(dispatch, data => dispatch(Gear.receivedFilterWheels(data)));
        }
    },

    receivedFilterWheels: filterWheels => {
        return { type: 'RECEIVED_FILTER_WHEELS', filterWheels};
    }



};

export default Gear
