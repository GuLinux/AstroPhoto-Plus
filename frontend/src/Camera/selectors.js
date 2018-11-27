import { createSelector } from 'reselect'
import { connectedCamerasSelector, connectedFilterWheelsSelector } from '../Gear/selectors'

const getCurrentCameraId = state => state.camera.currentCamera;
const getCurrentFilterWheelId = state => state.camera.currentFilterWheel;
const getOptions = state => state.camera.options;
const getROI = state => state.camera.crop;
const getIsShooting = state => state.camera.isShooting;
const getCrop = state => state.camera.crop;
const getCurrentImage = state => state.camera.currentImage;
const getImageLoading = state => state.camera.imageLoading;

export const getCurrentCamera = createSelector([getCurrentCameraId, connectedCamerasSelector], (currentCameraId, connectedCameras) => {
    if(! currentCameraId || ! connectedCameras.ids.includes(currentCameraId)) {
        return null;
    };
    return connectedCameras.get(currentCameraId);
})

export const getCurrentFilterWheel = createSelector([getCurrentFilterWheelId, connectedFilterWheelsSelector], (currentFilterWheelId, connectedFilterWheels) => {
    if(! currentFilterWheelId || ! connectedFilterWheels.ids.includes(currentFilterWheelId)) {
        return null;
    };
    return connectedFilterWheels.get(currentFilterWheelId);
})



export const getShotParameters = createSelector([getCurrentCamera, getOptions, getROI], (currentCamera, options, roi) => {
    return {
        camera: currentCamera,
        exposure: options.exposure,
        continuous: options.continuous,
        roi: roi && roi.pixel && roi.pixel,
    }
});

export const cameraContainerSelector = createSelector([getOptions, connectedCamerasSelector], (options, cameras) => ({
    options,
    cameras,
}));

export const cameraShootingSectionMenuEntriesSelector = createSelector([
    getOptions,
    connectedCamerasSelector,
    connectedFilterWheelsSelector,
    getCurrentCamera,
    getCurrentFilterWheel,
    getIsShooting,
], (
    options,
    cameras,
    filterWheels,
    currentCamera,
    currentFilterWheel,
    isShooting,
) => ({
    options,
    cameras,
    filterWheels,
    currentCamera,
    currentFilterWheel,
    isShooting,
}));

const getCanCrop = createSelector([getIsShooting, getCurrentImage, getImageLoading], (isShooting, currentImage, imageLoading) => {
    return !isShooting && !imageLoading && currentImage;
})

export const cameraImageOptionsSectionMenuEntriesSelector = createSelector([
    getOptions,
    connectedCamerasSelector,
    getCrop,
    getIsShooting,
    getCurrentImage,
    getImageLoading,
    getCanCrop,
], (
    options,
    cameras,
    crop,
    canCrop,
) => ({
    options,
    cameras,
    canCrop,
    crop,
}));