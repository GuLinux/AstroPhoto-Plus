import { fetchPHD2Status, startPHD2API, stopPHD2API, setPHD2ProfileAPI, startPHD2FramingAPI, startPHD2AutoguidingAPI, stopPHD2CaptureAPI } from '../middleware/api';
import { addNotification } from '../Notifications/actions';
import { getPHD2Connected, getPHD2StarLost } from './selectors';
import { networkOperationStarted, networkOperationFinished } from '../Network/actions';


export const updatePHD2Status = status => ({ type: 'UPDATE_PHD2_STATUS', status });

export const getPHD2Status = () => dispatch => {
    dispatch({ type: 'FETCHING_PHD2_STATUS' });
    fetchPHD2Status(dispatch, status => dispatch(updatePHD2Status(status)));
};


export const phd2Disconnected= payload => (dispatch, getState) => {
    if(getPHD2Connected(getState())) {
        dispatch(addNotification('PHD2 Disconnected', 'AstroPhoto Plus was disconnected from PHD2', 'warning', 5000));
        dispatch({ type: 'PHD2_DISCONNECTED', payload });
    }

};

export const phd2Connected = status => (dispatch, getState) => {
    if(!getPHD2Connected(getState())) {
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
    if(!getPHD2StarLost(getState())) {
        dispatch(addNotification('PHD2 Star Lost', 'PHD2 has lost the autoguiding star. Please check your frame for clouds, and try selecting a different star.', 'error', 5000));
    }
    dispatch({ type: 'PHD2_STAR_LOST' });
    dispatch(updatePHD2Status(status));
};

export const phd2GuideStep = (guideStep, status) => (dispatch, getState) => {
    if(getPHD2StarLost(getState())) {
        dispatch(addNotification('PHD2 Guiding', 'PHD2 Resumed autoguiding', 'info', 5000));
    }
    dispatch({ type: 'PHD2_GUIDE_STEP', guideStep });
    dispatch(updatePHD2Status(status));
};


export const phd2SetProfile = profile => dispatch => {
    const onSuccess = () => dispatch(networkOperationFinished());
    const onError = (response, isJSON) => {
        dispatch(networkOperationFinished());
        if(!isJSON) {
            return false;
        }
        response.json().then(json => dispatch(addNotification('PHD2', `Error setting PHD2 profile: ${json.error_message}`, 'warning', 5000)));
        return true;
    }
    dispatch(networkOperationStarted());
    setPHD2ProfileAPI(dispatch, profile, onSuccess, onError);
}


export const startPHD2 = (phd2Path, display) => dispatch => {
    dispatch({ type: 'PHD2_STARTING' });
    const onError = (response, isJSON) => {
        dispatch(networkOperationFinished());
        if(!isJSON) {
            return false;
        }
        response.json().then(json => dispatch(addNotification('PHD2', `Error starting PHD2: ${json.error_message}`, 'warning', 5000)));
        return true;
    }
    const onPHD2Started = payload => {
        dispatch({ type: 'PHD2_STARTED', payload });
        dispatch(networkOperationFinished());
    };
    dispatch(networkOperationStarted());
    startPHD2API({
        phd2_path: phd2Path,
        display
    }, dispatch, onPHD2Started, onError);
}

export const stopPHD2 = () => dispatch => {
    const onError = (response, isJSON) => {
        dispatch(networkOperationFinished());
        if(!isJSON) {
            return false;
        }
        response.json().then(json => dispatch(addNotification('PHD2', `Error stopping PHD2: ${json.error_message}`, 'warning', 5000)));
        return true;
    }

    const onPHD2Stopped = payload => {
        dispatch(networkOperationFinished());
        dispatch({ type: 'PHD2_STOPPED', payload });
    };
    dispatch({ type: 'PHD2_STOPPING' });
    dispatch(networkOperationStarted());
    stopPHD2API(dispatch, onPHD2Stopped, onError);
}

export const startPHD2Framing = () => dispatch => {
    const onError = (response, isJSON) => {
        dispatch(networkOperationFinished());
        if(!isJSON) {
            return false;
        }
        response.json().then(json => dispatch(addNotification('PHD2', `Error starting PHD2 capture: ${json.error_message}`, 'warning', 5000)));
        return true;
    }

    dispatch(networkOperationStarted());
    startPHD2FramingAPI(dispatch, () => dispatch(networkOperationFinished()), onError);
}

export const startPHD2Guiding = () => dispatch => {
    const onError = (response, isJSON) => {
        dispatch(networkOperationFinished());
        if(!isJSON) {
            return false;
        }
        response.json().then(json => dispatch(addNotification('PHD2', `Error starting PHD2 autoguiding: ${json.error_message}`, 'warning', 5000)));
        return true;
    }

    dispatch(networkOperationStarted());
    startPHD2AutoguidingAPI(dispatch, {}, () => dispatch(networkOperationFinished()), onError);
}

export const stopPHD2Capture = () => dispatch => {
    const onError = (response, isJSON) => {
        dispatch(networkOperationFinished());
        if(!isJSON) {
            return false;
        }
        response.json().then(json => dispatch(addNotification('PHD2', `Error stopping PHD2 capture: ${json.error_message}`, 'warning', 5000)));
        return true;
    }

    dispatch(networkOperationStarted());
    stopPHD2CaptureAPI(dispatch, () => dispatch(networkOperationFinished()), onError);
}


