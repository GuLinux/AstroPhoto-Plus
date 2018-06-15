import { createSelector } from 'reselect'
import { getGear, getConnectedCameras } from '../Gear/selectors'

const getCurrentCameraId = (state) => state.camera.currentCamera;

export const getCurrentCamera = createSelector([getCurrentCameraId, getGear, getConnectedCameras], (currentCameraId, gear, connectedCameras) => {
    if(! currentCameraId || ! connectedCameras.includes(currentCameraId)) {
        return null;
    };
    return gear.cameraEntities[currentCameraId];
})

