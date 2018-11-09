import { getTelescopesAPI, getCamerasAPI, getFilterWheelsAPI } from '../middleware/api'
import Actions from '../actions';

const Gear = {
    fetchAll: dispatch => {
        dispatch(Actions.Gear.fetchCameras())
        dispatch(Actions.Gear.fetchFilterWheels())
        dispatch(Actions.Gear.fetchTelescopes())
    },

    fetchCameras: () => {
        return dispatch => {
            dispatch({type: 'FETCH_CAMERAS'});
            return getCamerasAPI(
                dispatch,
                data => dispatch(Gear.receivedCameras(data)),
                async error => {
                    if(error.status === 400) {
                        let errorData = await error.json();
                        dispatch(Actions.Notifications.add('Error fetching gear', `Unable to fetch cameras: ${errorData.error_message}`, 'warning', 5000));
                        return true;
                    }
                    return false;
                }
            );
        }
    },

    receivedCameras: cameras => {
        return { type: 'RECEIVED_CAMERAS', cameras };
    },

    fetchFilterWheels: () => {
        return dispatch => {
            dispatch({type: 'FETCH_FILTER_WHEELS'});
            return getFilterWheelsAPI(
                dispatch,
                data => dispatch(Gear.receivedFilterWheels(data)),
                async error => {
                    if(error.status === 400) {
                        let errorData = await error.json();
                        dispatch(Actions.Notifications.add('Error fetching gear', `Unable to fetch filter wheels: ${errorData.error_message}`, 'warning', 5000));
                        return true;
                    }
                    return false;
                }
            );
        }
    },

    receivedFilterWheels: filterWheels => {
        return { type: 'RECEIVED_FILTER_WHEELS', filterWheels};
    },

    fetchTelescopes: () => {
        return dispatch => {
            dispatch({type: 'FETCH_TELESCOPES'});
            return getTelescopesAPI(
                dispatch,
                data => dispatch(Gear.receivedTelescopes(data)),
                async error => {
                    if(error.status === 400) {
                        let errorData = await error.json();
                        dispatch(Actions.Notifications.add('Error fetching gear', `Unable to fetch telescopes: ${errorData.error_message}`, 'warning', 5000));
                        return true;
                    }
                    return false;
                }
            );
        }
    },

    receivedTelescopes: telescopes => {
        return { type: 'RECEIVED_TELESCOPES', telescopes};
    }


};

export default Gear
