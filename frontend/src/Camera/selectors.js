import { createSelector } from 'reselect'
import {
    getConnectedCameras,
    getConnectedFilterWheels,
    getCameraExposureValue,
    getFilterWheelCurrentFilter,
    getFilterWheelCurrentFilterName,
    getFilterWheelAvailableFiltersProperty,
    getFilterWheelFilterName,
    getCameraBinningValue,
} from '../Gear/selectors'
import { getDevices } from '../INDI-Server/selectors';
import { get } from 'lodash';
import { imageUrlBuilder } from '../utils';

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
        binning: options.binning,
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
    getConnectedCameras,
    getCrop,
    getCanCrop,
], (
    cameras,
    crop,
    canCrop,
) => ({
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


export const currentImageSelector = createSelector(
    [
        getCurrentCamera,
        state => state.camera.currentImage,
        state => state.camera.options,
        state => state.camera.crop,
    ],
    (currentCamera, currentImage, options, crop) => {
        if(! currentCamera || ! currentImage) {
            return { }
        }
        return {
            uri: imageUrlBuilder(currentImage.id, {...options, type: 'camera' }),
            id: currentImage.id,
            type: 'camera',
            imageInfo: currentImage.image_info,
            crop,
        }
});

export const cameraBinningSelector = createSelector([getCameraBinningValue, getOptions],
    (binning, options) => {
        const selectedBinning = get(options, 'binning', get(binning, 'value'));
        return { binning, selectedBinning };
    }
);

