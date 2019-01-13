import { cameraShootAPI } from '../middleware/api';
import Actions from '../actions';
import { getCurrentFilterWheelId } from './selectors';
import { getPropertyId } from '../INDI-Server/utils';


const Camera = {
    setCamera: (camera) => ({ type: 'SET_CURRENT_CAMERA', camera }),
    setFilterWheel: (filterWheel) => ({ type: 'SET_CURRENT_FILTER_WHEEL', filterWheel}),
    setOption: (option) => ({ type: 'CAMERA_SET_OPTION', option }),
    imageLoading: () => ({ type: 'CAMERA_IMAGE_LOADING' }),
    imageLoaded: () => ({ type: 'CAMERA_IMAGE_LOADED' }),
    startCrop: () => ({ type: 'CAMERA_START_CROP' }),
    resetCrop: () => ({ type: 'CAMERA_RESET_CROP' }),
    setCrop: (crop) => ({ type: 'CAMERA_SET_CROP', crop }),

    shoot: (parameters) => (dispatch) => {
        dispatch({ type: 'CAMERA_SHOOT', parameters });
        return cameraShootAPI(dispatch, parameters.camera.id, parameters, (data) => dispatch(Camera.shotFinished(data, parameters.continuous)), (err) => {
            if(err.headers.get('Content-Type') === 'application/json') {
                err.json().then( (errorData) => dispatch(Camera.shotError(errorData)) );
                return true;
            }
            return false;
        });
    },

    shotFinished: (payload, continuous) => dispatch => {
        dispatch({ type: 'CAMERA_SHOT_FINISHED', payload });
        dispatch(Actions.PlateSolving.solveCameraImage(payload.filename));
        if(!continuous)
            dispatch(Actions.Notifications.add('Image acquired', 'Image was successfully acquired.', 'success', 5000));
    },

    shotError: (error) => dispatch => {
        dispatch({ type: 'CAMERA_SHOT_ERROR', error });
        let errorMessage = [
            'There was an error acquiring your image.',
            'The messages section in the INDI control panel might contain more information.'
        ];
        if(error.error_message) {
            errorMessage.push(error.error_message);
        }
        dispatch(Actions.Notifications.add('Image error', errorMessage , 'error'));
    },
    changeFilter: (value) => (dispatch, getState) => {
        const state = getState();
        const filterWheelId = getCurrentFilterWheelId(state);
        dispatch({ type: 'CAMERA_CHANGE_FILTER', device: filterWheelId, property: getPropertyId(filterWheelId, 'FILTER_SLOT'), value });
        dispatch(Actions.INDIServer.setPropertyValues({name: filterWheelId}, {name: 'FILTER_SLOT'}, {FILTER_SLOT_VALUE: value}));
    },
};

export default Camera;
