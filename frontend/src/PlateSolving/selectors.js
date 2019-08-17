import { createSelector } from 'reselect';
import {
    filterDevices,
    getConnectedCameras,
    getConnectedTelescopes,
    getCCDWidthPix,
    getCCDPixelPitch,
    getTelescopeFocalLength,
} from '../Gear/selectors';
import { getMessages, getDevices } from '../INDI-Server/selectors';
import { PlateSolving } from './actions';
import { get } from 'lodash';

const getPlateSolvingOptions = state => state.plateSolving.options;
const getOption = (state, option) => getPlateSolvingOptions(state)[option];

const getSolution = state => state.plateSolving.solution;


const getPlateSolvingDevices = createSelector([
    getConnectedCameras,
    getConnectedTelescopes,
    getDevices,
], (camerasIds, telescopesIds, devices) => ({
    telescopes: filterDevices(devices, telescopesIds),
    cameras:    filterDevices(devices, camerasIds),
}))


const getDeviceId = (deviceOptionName, state) => getOption(state, deviceOptionName);

export const plateSolvingContainerSelector = createSelector([
    getPlateSolvingDevices,
    getMessages,
    getPlateSolvingOptions,
    getSolution,
    state => state.plateSolving.loading,
    state => getCCDWidthPix(state, {cameraId: getDeviceId(PlateSolving.Options.fovSource, state)}),
    state => getCCDPixelPitch(state, {cameraId: getDeviceId(PlateSolving.Options.fovSource, state)}),
    state => getTelescopeFocalLength(state, {telescopeId: getDeviceId(PlateSolving.Options.telescope, state)}),
], (plateSolvingDevices, messages, options, solution, loading, ccdMaxX, ccdPixelSizeX, telescopeFocalLength) => ({
    ...plateSolvingDevices,
    messages: [],
    options,
    solution,
    loading,
    isManualFOV: options[PlateSolving.Options.fovSource] === 'manual',
    ccdInfo: {
        ccdMaxX: get(ccdMaxX, 'value'),
        ccdPixelSizeX: get(ccdPixelSizeX, 'value'),
    },
    telescopeFocalLength: get(telescopeFocalLength, 'value'),
}));

export const plateSolvingSectionMenuSelector = createSelector([getPlateSolvingOptions], options => ({
    listenToCamera: options[PlateSolving.Options.camera],
}))

export const solveFromCameraSelector = createSelector([getPlateSolvingOptions], options => ({options}));

const getAstrometryAvailable = state => state.plateSolving.available;

export const plateSolvingPageContainerSelector = createSelector([getAstrometryAvailable, getConnectedTelescopes], (astrometryAvailable, telescopes) => ({
    hasAstrometry: astrometryAvailable,
    hasTelescopes: telescopes.length > 0,
}));

