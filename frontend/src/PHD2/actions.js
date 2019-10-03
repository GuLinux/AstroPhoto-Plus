import { fetchPHD2Status, fetchPHD2Start, fetchPHD2Stop } from '../middleware/api';
import { addNotification } from '../Notifications/actions';
import { getPHD2State } from './selectors';


export const updatePHD2Status = status => ({ type: 'UPDATE_PHD2_STATUS', status });

export const getPHD2Status = () => dispatch => {
    dispatch({ type: 'FETCHING_PHD2_STATUS' });
    fetchPHD2Status(dispatch, status => dispatch(updatePHD2Status(status)));
};


export const phd2Disconnected= payload => (dispatch, getState) => {
    if(getPHD2State(getState()).connected) {
        dispatch(addNotification('PHD2 Disconnected', 'AstroPhoto Plus was disconnected from PHD2', 'warning', 5000));
    }
    dispatch({ type: 'PHD2_DISCONNECTED', payload });
};

export const phd2Connected = status => (dispatch, getState) => {
    if(!getPHD2State(getState()).connected) {
        dispatch(addNotification('PHD2 Connected', 'AstroPhoto Plus is now connected to PHD2', 'success', 5000));
    }
    dispatch(updatePHD2Status(status));
};

export const phd2GuidingStarted = status => (dispatch, getState) => {
    dispatch(addNotification('PHD2 Guiding', 'PHD2 autoguiding started', 'success', 5000));
    dispatch(updatePHD2Status(status));
};
export const phd2GuidingStopped = status => (dispatch, getState) => {
    dispatch(addNotification('PHD2 Guiding', 'PHD2 autoguiding stopped', 'info', 5000));
    dispatch(updatePHD2Status(status));
};
export const phd2StarLost = status => (dispatch, getState) => {
    if(!getPHD2State(getState()).starLost) {
        dispatch(addNotification('PHD2 Star Lost', 'PHD2 has lost the autoguiding star. Please check your frame for clouds, and try selecting a different star.', 'error', 5000));
    }
    dispatch({ type: 'PHD2_STAR_LOST' });
    dispatch(updatePHD2Status(status));
};

export const phd2GuideStep = (guideStep, status) => (dispatch, getState) => {
    if(getPHD2State(getState()).starLost) {
        dispatch(addNotification('PHD2 Guiding', 'PHD2 Resumed autoguiding', 'info', 5000));
    }
    dispatch({ type: 'PHD2_GUIDE_STEP', guideStep });
    dispatch(updatePHD2Status(status));
};




export const startPHD2 = (phd2Path, display) => dispatch => {
    dispatch({ type: 'PHD2_STARTING' });
    const onError = (response, isJSON) => {
        if(!isJSON) {
            return false;
        }
        response.json().then(json => dispatch(addNotification('PHD2', `Error starting PHD2: ${json.error_message}`, 'warning', 5000)));
        return true;
    }
    const onPHD2Started = payload => dispatch({ type: 'PHD2_STARTED', payload });
    fetchPHD2Start({
        phd2_path: phd2Path,
        display
    }, dispatch, onPHD2Started, onError);
}

export const stopPHD2 = () => dispatch => {
    const onError = (response, isJSON) => {
        if(!isJSON) {
            return false;
        }
        response.json().then(json => dispatch(addNotification('PHD2', `Error stopping PHD2: ${json.error_message}`, 'warning', 5000)));
        return true;
    }

    const onPHD2Stopped = payload => dispatch({ type: 'PHD2_STOPPED', payload });
    dispatch({ type: 'PHD2_STOPPING' });
    fetchPHD2Stop(dispatch, onPHD2Stopped, onError);
}
