const defaultState = {
    options: {
        format: 'png',
        clipLow: 0,
        clipHigh: 100,
    }
};

const setOption = (state, option) => ({
    ...state,
    options: {
        ...state.options,
        ...option,
    }
})

const onCameraShotFinished = (state, action) => ({
    ...state, isShooting: false,
    currentImage: action.payload,
    shouldAutostart: !state.imageLoading && state.options.continuous,
});

const onImageLoadingFinished = (state) => ({
    ...state,
    imageLoading: false,
    shouldAutostart: state.options.continuous,
})

const onCameraShotError = (state, action) => ({
    ...state,
    isShooting: false,
    shouldAutostart: false,
});

const onCameraShoot = (state, action) => ({
    ...state,
    isShooting: true,
    shouldAutostart: false,
})

const camera = (state = defaultState, action) => {
    switch(action.type) {
        case 'SET_CURRENT_CAMERA':
            return {...state, currentCamera: action.camera };
        case 'CAMERA_SET_OPTION':
            return setOption(state, action.option);
        case 'CAMERA_SHOOT':
            return onCameraShoot(state, action);
        case 'CAMERA_SHOT_FINISHED':
            return onCameraShotFinished(state, action);
        case 'CAMERA_SHOT_ERROR':
            return onCameraShotError(state, action);
        case 'CAMERA_IMAGE_LOADING':
            return {...state, imageLoading: true};
        case 'CAMERA_IMAGE_LOADED':
            return onImageLoadingFinished(state);
        default:
            return state;
    }
};

export default camera;
