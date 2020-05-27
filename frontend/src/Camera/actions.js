import { cameraShootAPI } from '../middleware/api';
import Actions from '../actions';
import { getCurrentFilterWheelId } from './selectors';
import { getPropertyId } from '../INDI-Server/utils';

export const shoot = (parameters, section='default') => (dispatch) => {
    dispatch({ type: 'CAMERA_SHOOT', parameters, section });
    return cameraShootAPI(dispatch, parameters.camera.id, parameters, (data) => dispatch(shotFinished(data, parameters.continuous)), (err) => {
        if(err.headers.get('Content-Type') === 'application/json') {
            err.json().then( (errorData) => dispatch(shotError(errorData)) );
            return true;
        }
        return false;
    });
}

export const setCamera = (camera, section='default') => ({ type: 'SET_CURRENT_CAMERA', camera, section });
export const setFilterWheel = (filterWheel, section='default') => ({ type: 'SET_CURRENT_FILTER_WHEEL', filterWheel, section });
export const setOption = (option, section='default') => ({ type: 'CAMERA_SET_OPTION', option, section});
export const startCrop = ({section='default'}) => ({ type: 'CAMERA_START_CROP', section });
export const resetCrop = (section='default') => ({ type: 'CAMERA_RESET_CROP', section });

export const imageLoading = ({section='default'}) => ({ type: 'CAMERA_IMAGE_LOADING', section });
export const imageLoaded = ({section='default'}) => ({ type: 'CAMERA_IMAGE_LOADED', section });
export const setCrop = (crop, section='default') => ({ type: 'CAMERA_SET_CROP', crop, section});
export const shotFinished = (payload, continuous, section='default') => dispatch => {
    dispatch({ type: 'CAMERA_SHOT_FINISHED', payload, section });
    if(!continuous)
        dispatch(Actions.Notifications.add('Image acquired', 'Image was successfully acquired.', 'success', 5000));
};

export const shotError = (error, section='default') => dispatch => {
    dispatch({ type: 'CAMERA_SHOT_ERROR', error, section});
    let errorMessage = [
        'There was an error acquiring your image.',
        'The messages section in the INDI control panel might contain more information.'
    ];
    if(error.error_message) {
        errorMessage.push(error.error_message);
    }
    dispatch(Actions.Notifications.add('Image error', errorMessage , 'error'));
};

export const changeFilter = (value, section='default') => (dispatch, getState) => {
    const state = getState();
    const filterWheelId = getCurrentFilterWheelId(state, {section});

    dispatch({ type: 'CAMERA_CHANGE_FILTER', device: filterWheelId, property: getPropertyId(filterWheelId, 'FILTER_SLOT'), value, section });
    dispatch(Actions.INDIServer.setPropertyValues({name: filterWheelId}, {name: 'FILTER_SLOT'}, {FILTER_SLOT_VALUE: value}));
};

