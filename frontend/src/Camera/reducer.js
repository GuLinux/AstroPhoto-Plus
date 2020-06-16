import { set, merge } from 'lodash/fp';
import { CAMERA_PAGE, DARV_PAGE, PLATESOLVING_PAGE, POLAR_DRIFT } from './sections';

const getSectionState = (options={}) => ({
    options: {
        format: 'png',
        clipLow: 0,
        clipHigh: 100,
        stretch: true,
        fitToScreen: true,
        ...options,
    },
});


const defaultState = {
    [CAMERA_PAGE]: getSectionState(),
    [DARV_PAGE]: getSectionState(),
    [PLATESOLVING_PAGE]: getSectionState(),
    [POLAR_DRIFT]: getSectionState(),
};



const setOption = (state, {option, section}) => {
    const { options } = state[section];
    return set([section, 'options'], {...options, ...option}, state);
}

const onCameraShotFinished = (state, {section, payload}) => {
    let newState = set([section, 'isShooting'], false, state);
    return set([section, 'currentImage'], payload, newState);
}

const setImageLoading = (state, {section}) => set([section, 'imageLoading'], true, state);

const onImageLoadingFinished = (state, {section}) => {
    let newState = set([section, 'imageLoading'], false, state);
    return set([section, 'shouldAutostart'], newState[section].options.continuous, newState);
};

const onCameraShotError = (state, {section}) => {
    let newState = set([section, 'isShooting'], false, state);
    return set([section, 'shouldAutostart'], false, newState);
};

const onCameraShoot = (state, {section}) => {
    let newState = set([section, 'isShooting'], true, state);
    newState = set([section, 'shouldAutostart'], false, newState);
    const crop = newState[section].crop && newState[section].crop.pixel ? { pixel: newState[section].crop.pixel, applied: true } : false;
    return set([section, 'crop'], crop, newState);
};

const cameraStartCrop = (state, {section}) => set([section, 'crop'], { initial: true }, state);

const cameraSetCrop = (state, {crop, section}) => set([section, 'crop'], {...crop, applied: false }, state);

const cameraResetCrop = (state, {section}) => { 
    const crop = state.crop && state.crop.applied ? { canceled: true} : false
    return set([section, 'crop'], crop, state);
};

// TODO: this might need to be moved to sections too
const onINDIPropertyUpdated = (state, action) => {
    if(state.pendingFilter && action.property.id === state.pendingFilter.property && action.property.device === state.pendingFilter.device) {
        return {...state, pendingFilter: null }
    }
    return state;
}

export const camera = (state = defaultState, action) => {
    switch(action.type) {
        case 'SET_CURRENT_CAMERA':
            return set([action.section, 'currentCamera'], action.camera, state);
        case 'SET_CURRENT_FILTER_WHEEL':
            return set([action.section, 'currentFilterWheel'], action.filterWheel, state);
        case 'CAMERA_SET_OPTION':
            return setOption(state, action);
        case 'CAMERA_SHOOT':
            return onCameraShoot(state, action);
        case 'CAMERA_SHOT_FINISHED':
            return onCameraShotFinished(state, action);
        case 'CAMERA_SHOT_ERROR':
            return onCameraShotError(state, action);
        case 'CAMERA_IMAGE_LOADING':
            return setImageLoading(state, action)
        case 'CAMERA_IMAGE_LOADED':
            return onImageLoadingFinished(state, action);
        case 'CAMERA_CHANGE_FILTER':
            return {...state, pendingFilter: { device: action.device, property: action.property }};
        case 'INDI_PROPERTY_UPDATED':
            return onINDIPropertyUpdated(state, action);
        case 'CAMERA_START_CROP':
            return cameraStartCrop(state, action);
        case 'CAMERA_SET_CROP':
            return cameraSetCrop(state, action);
        case 'CAMERA_RESET_CROP':
            return cameraResetCrop(state, action);

        default:
            return state;
    }
};
