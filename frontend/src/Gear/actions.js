import {
    getTelescopesAPI,
    getCamerasAPI,
    getFilterWheelsAPI,
    getAstrometryDriversAPI,
} from '../middleware/api';
import Actions from '../actions';

const fetchGear = (apiMethod, fetchActionName, receivedActionName, errorObjectName) => {
    return dispatch => {
        dispatch({type: 'FETCH_CAMERAS'});
        return apiMethod(
            dispatch,
            payload => dispatch({ type: receivedActionName, payload}),
            async error => {
                if(error.status === 400) {
                    let errorData = await error.json();
                    dispatch(Actions.Notifications.add('Error fetching gear', `Unable to fetch ${errorObjectName}: ${errorData.error_message}`, 'warning', 5000));
                    return true;
                }
                return false;
            }
        );
    }
}

const Gear = {
    fetchAll: dispatch => {
        dispatch(Actions.Gear.fetchCameras())
        dispatch(Actions.Gear.fetchFilterWheels())
        dispatch(Actions.Gear.fetchTelescopes())
        dispatch(Actions.Gear.fetchAstrometryDrivers())
    },

    fetchCameras: () => fetchGear(getCamerasAPI, 'FETCH_CAMERAS', 'RECEIVED_CAMERAS', 'cameras'),
    fetchFilterWheels: () => fetchGear(getFilterWheelsAPI, 'FETCH_FILTER_WHEELS', 'RECEIVED_FILTER_WHEELS', 'filter wheels'),
    fetchTelescopes: () => fetchGear(getTelescopesAPI, 'FETCH_TELESCOPES', 'RECEIVED_TELESCOPES', 'telescopes'),
    fetchAstrometryDrivers: () => fetchGear(getAstrometryDriversAPI, 'FETCH_ASTROMETRY_DRIVERS', 'RECEIVED_ASTROMETRY_DRIVERS', 'astrometry'),
};

export default Gear
