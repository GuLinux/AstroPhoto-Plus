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


const getCameraState = (state, {section='default'}) => state.camera[section];

const getCurrentCameraId = (state, props) => getCameraState(state, props).currentCamera;
export const getCurrentFilterWheelId = (state, props) => getCameraState(state, props).currentFilterWheel;
const getOptions = (state, props) => getCameraState(state, props).options;
const getROI = (state, props) => getCameraState(state, props).crop;
const getIsShooting = (state, props) => getCameraState(state, props).isShooting;
const getCrop = (state, props) => getCameraState(state, props).crop;
const getCurrentImage = (state, props) => getCameraState(state, props).currentImage;
const getImageLoading = (state, props) => getCameraState(state, props).imageLoading;
const getHasPendingFilter = (state, props) => !!state.camera.pendingFilter;
const getShouldAutostart = (state, props) => getCameraState(state, props).shouldAutostart;



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


// TODO: remove this component by using getState in actions
export const autoExposureSelector = createSelector([getShotParameters, getShouldAutostart], (shotParameters, shouldAutostart) => ({ shotParameters, shouldAutostart }));

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
    getCurrentImage,
], (
    cameras,
    crop,
    canCrop,
    currentImage,
) => ({
    cameras,
    crop,
    canCrop,
    imageId: currentImage && currentImage.id,
}));


const getSelectedCameraExposureValue = (state, {cameraId}) => cameraId && getCameraExposureValue(state, {cameraId})


export const exposureInputSelector = createSelector([
    getShotParameters,
    getSelectedCameraExposureValue,
    getIsShooting,
], (shotParameters, cameraExposureValue, isShooting) => {
    return {
        shotParameters,
        isShooting,
        cameraExposureValue,
    }
});


export const selectFilterSelector = createSelector([
    getHasPendingFilter,
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
        getCurrentImage,
        getOptions,
        getCrop,
    ],
    (currentCamera, currentImage, options, crop) => {
        if(! currentCamera || ! currentImage) {
            return { }
        }
        return {
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

