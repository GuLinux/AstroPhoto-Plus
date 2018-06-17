import { createSelector } from 'reselect'
import { getGear, getConnectedCameras } from '../Gear/selectors'

const getCurrentCameraId = (state) => state.camera.currentCamera;
const getOptions = (state) => state.camera.options;

export const getCurrentCamera = createSelector([getCurrentCameraId, getGear, getConnectedCameras], (currentCameraId, gear, connectedCameras) => {
    if(! currentCameraId || ! connectedCameras.includes(currentCameraId)) {
        return null;
    };
    return gear.cameraEntities[currentCameraId];
})

export const getShotParameters = createSelector([getCurrentCamera, getOptions], (currentCamera, options) => {
    return {
        camera: currentCamera,
        exposure: options.exposure,
        continuous: options.continuous,
    }
});
