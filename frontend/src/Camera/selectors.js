import { createSelector } from 'reselect'
import { getGear, getConnectedCameras } from '../Gear/selectors'

const getCurrentCameraId = (state) => state.camera.currentCamera;
const getExposure = (state) => state.camera.exposure;
const getContinuous = (state) => state.camera.continuous;

export const getCurrentCamera = createSelector([getCurrentCameraId, getGear, getConnectedCameras], (currentCameraId, gear, connectedCameras) => {
    if(! currentCameraId || ! connectedCameras.includes(currentCameraId)) {
        return null;
    };
    return gear.cameraEntities[currentCameraId];
})

export const getShotParameters = createSelector([getCurrentCamera, getExposure, getContinuous], (currentCamera, exposure, continuous) => {
    return {
        camera: currentCamera,
        exposure,
        continuous,
    }
});
