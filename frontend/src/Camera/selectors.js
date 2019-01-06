import { createSelector } from 'reselect'
import { getConnectedCameras, getConnectedFilterWheels, getCameraExposureValue, getFilterWheelCurrentFilter, getFilterWheelCurrentFilterName, getFilterWheelAvailableFiltersProperty, getFilterWheelFilterName } from '../Gear/selectors'
import { getDevices } from '../INDI-Server/selectors';
import { get } from 'lodash';

const getCurrentCameraId = state => state.camera.currentCamera;
export const getCurrentFilterWheelId = state => state.camera.currentFilterWheel;
const getOptions = state => state.camera.options;
const getROI = state => state.camera.crop;
const getIsShooting = state => state.camera.isShooting;
const getCrop = state => state.camera.crop;
const getCurrentImage = state => state.camera.currentImage;
const getImageLoading = state => state.camera.imageLoading;


export const getCurrentCamera = createSelector([getCurrentCameraId, getConnectedCameras, getDevices], (currentCameraId, connectedCameras, devices) => {
    if(! currentCameraId || ! connectedCameras.includes(currentCameraId)) {
        return null;
    };
    return devices.entities[currentCameraId];
})

export const getCurrentFilterWheel = createSelector([getCurrentFilterWheelId, getConnectedFilterWheels, getDevices], (currentFilterWheelId, connectedFilterWheels, devices) => {
    if(! currentFilterWheelId || ! connectedFilterWheels.includes(currentFilterWheelId)) {
        return null;
    };
    return devices.entities[currentFilterWheelId];
})



export const getShotParameters = createSelector([getCurrentCamera, getOptions, getROI], (currentCamera, options, roi) => {
    return {
        camera: currentCamera,
        exposure: options.exposure,
        continuous: options.continuous,
        roi: roi && roi.pixel && roi.pixel,
    }
});

export const cameraContainerSelector = createSelector([getOptions, getConnectedCameras], (options, cameras) => ({
    options,
    cameras,
}));

const mapDevices = (ids, devices) => ids.map(id => devices.entities[id]);

export const cameraShootingSectionMenuEntriesSelector = createSelector([
    getOptions,
    getConnectedCameras,
    getConnectedFilterWheels,
    getCurrentCamera,
    getCurrentFilterWheel,
    getIsShooting,
    getDevices,
], (
    options,
    cameras,
    filterWheels,
    currentCamera,
    currentFilterWheel,
    isShooting,
    devices,
) => ({
    options,
    cameras: mapDevices(cameras, devices),
    filterWheels: mapDevices(filterWheels, devices),
    currentCamera,
    currentFilterWheel,
    isShooting,
}));

const getCanCrop = createSelector([getIsShooting, getCurrentImage, getImageLoading], (isShooting, currentImage, imageLoading) =>
    (!isShooting) && (!imageLoading) && !!currentImage);

export const cameraImageOptionsSectionMenuEntriesSelector = createSelector([
    getOptions,
    getConnectedCameras,
    getCrop,
    getCanCrop,
], (
    options,
    cameras,
    crop,
    canCrop,
) => ({
    options,
    cameras,
    crop,
    canCrop,
}));


const getSelectedCameraExposureValue = (state, {cameraId}) => cameraId && getCameraExposureValue(state, {cameraId})


export const exposureInputSelector = createSelector([
    getShotParameters,
    getSelectedCameraExposureValue,
    state => state.camera.isShooting,
], (shotParameters, cameraExposureValue, isShooting) => {
    return {
        shotParameters,
        isShooting,
        cameraExposureValue,
    }
});


export const selectFilterSelector = createSelector([
    state => !!state.camera.pendingFilter,
    getFilterWheelCurrentFilter,
    getFilterWheelCurrentFilterName,
    getFilterWheelAvailableFiltersProperty,
], (isPending, currentFilter, currentFilterName, availableFilters) => ({
        isPending,
        currentFilter: get(currentFilter, 'value'),
        currentFilterName: get(currentFilterName, 'value'),
        availableFilters: get(availableFilters, 'values', []),
}));

export const filterSelectionSelector = createSelector([
    getFilterWheelFilterName,
], ({value: filterName}) => ({filterName}));
