const defaultState = {
    options: {
        format: 'png',
        clipLow: 0,
        clipHigh: 100,
        stretch: true,
        fitToScreen: true,
        histogramBins: 255,
    }
};

const setOption = (state, option) => ({
    ...state,
    options: {
        ...state.options,
        ...option,

    },
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
    histogram: null,
    crop: state.crop && state.crop.pixel ? { pixel: state.crop.pixel, applied: true } : false,
})

const cameraStartCrop = (state) => ({...state, crop: { initial: true } });

const cameraSetCrop = (state, action) => ({...state, crop: {...action.crop, applied: false}});
const cameraResetCrop = (state, action) => { 
    const crop = state.crop && state.crop.applied ? { canceled: true} : false
    return {...state, crop };
}

const onINDIPropertyUpdated = (state, action) => {
    if(state.pendingFilter && action.property.id === state.pendingFilter.property && action.property.device === state.pendingFilter.device) {
        return {...state, pendingFilter: null }
    }
    return state;
}

const camera = (state = defaultState, action) => {
    switch(action.type) {
        case 'SET_CURRENT_CAMERA':
            return {...state, currentCamera: action.camera, histogram: null };
        case 'SET_CURRENT_FILTER_WHEEL':
            return {...state, currentFilterWheel: action.filterWheel, pendingFilter: null };
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
        case 'CAMERA_LOAD_HISTOGRAM':
            return {...state, histogram: { loading: true }};
        case 'CAMERA_HISTOGRAM_LOADED':
            return {...state, histogram: action.histogram }
        case 'CAMERA_HISTOGRAM_ERROR':
            return {...state, histogram: { error: action.error }};
        case 'CAMERA_CHANGE_FILTER':
            return {...state, pendingFilter: { device: action.device, property: action.property }};
        case 'INDI_PROPERTY_UPDATED':
            return onINDIPropertyUpdated(state, action);
        case 'CAMERA_START_CROP':
            return cameraStartCrop(state);
        case 'CAMERA_SET_CROP':
            return cameraSetCrop(state, action);
        case 'CAMERA_RESET_CROP':
            return cameraResetCrop(state, action);

        default:
            return state;
    }
};

export default camera;
