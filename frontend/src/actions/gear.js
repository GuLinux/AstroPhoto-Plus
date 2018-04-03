import { getCamerasAPI } from '../middleware/api'

const Gear = {
    fetchCameras: () => {
        return dispatch => {
            dispatch({type: 'FETCH_CAMERAS'});
            return getCamerasAPI(dispatch, data => dispatch(Gear.receivedCameras(data)));
        }
    },

    receivedCameras: cameras => {
        return { type: 'RECEIVED_CAMERAS', cameras };
    }

};

export default Gear
