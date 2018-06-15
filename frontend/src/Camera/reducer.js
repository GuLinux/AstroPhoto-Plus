const defaultState = {
    format: 'png',
};

const onCameraShotFinished = (state, action) => ({
    ...state, isShooting: false,
    currentImage: action.payload,
});

const onCameraShotError = (state, action) => ({
    ...state, isShooting: false,
});

const camera = (state = defaultState, action) => {
    switch(action.type) {
        case 'SET_CURRENT_CAMERA':
            return {...state, currentCamera: action.camera};
        case 'SET_EXPOSURE':
            return {...state, exposure: action.exposure};
        case 'CAMERA_SET_STRETCH':
            return {...state, stretch: action.stretch};
        case 'CAMERA_SET_FORMAT':
            return {...state, format: action.format};
        case 'CAMERA_IMG_FIT_SCREEN':
            return {...state, fitToScreen: action.fitToScreen};
        case 'CAMERA_SHOOT':
            return {...state, isShooting: true};
        case 'CAMERA_SHOT_FINISHED':
            return onCameraShotFinished(state, action);
        case 'CAMERA_SHOT_ERROR':
            return onCameraShotError(state, action);
        default:
            return state;
    }
};

export default camera;
