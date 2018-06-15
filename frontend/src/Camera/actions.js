import { cameraShootAPI } from '../middleware/api';
import Actions from '../actions';


const Camera = {
    setCamera: (camera) => ({ type: 'SET_CURRENT_CAMERA', camera }),
    setExposure: (exposure) => ({ type: 'SET_EXPOSURE', exposure }),
    shoot: (parameters) => (dispatch) => {
        dispatch({ type: 'CAMERA_SHOOT', parameters });
        return cameraShootAPI(dispatch, parameters.camera.id, parameters, (data) => dispatch(Camera.shotFinished(data)), (err) => dispatch(Camera.shotError(err)));
    },

    shotFinished: (payload) => dispatch => {
        dispatch({ type: 'CAMERA_SHOT_FINISHED', payload })
        dispatch(Actions.Notifications.add('Image acquired', 'Image was successfully acquired.', 'success', 5000));
    },

    shotError: (error) => dispatch => {
        dispatch({ type: 'CAMERA_SHOT_ERROR', error }),
        dispatch(Actions.Notifications.add('Image error', 'There was an error acquiring your image. The messages section in the INDI control panel might contain more information.', 'error'));
    }
};

export default Camera;
