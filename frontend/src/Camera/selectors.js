import { createSelector } from 'reselect'
import { getGear, connectedCamerasSelector, connectedFilterWheelsSelector } from '../Gear/selectors'

const getCurrentCameraId = (state) => state.camera.currentCamera;
const getCurrentFilterWheelId = (state) => state.camera.currentFilterWheel;
const getOptions = (state) => state.camera.options;
const getROI = (state) => state.camera.crop;

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
