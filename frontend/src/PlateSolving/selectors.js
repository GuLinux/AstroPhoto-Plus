import { createSelector } from 'reselect';
import { transform } from 'lodash';
import {
    filterDevices,
    getConnectedAstrometry,
    getConnectedCameras,
    getConnectedTelescopes,
} from '../Gear/selectors';
import { getMessages, getDevices } from '../INDI-Server/selectors-redo';
import { PlateSolving } from './actions';


const getPlateSolvingOptions = state => state.plateSolving.options;

const getSolution = state => state.plateSolving.solution;


const getPlateSolvingDevices = createSelector([
    getConnectedAstrometry,
    getConnectedCameras,
    getConnectedTelescopes,
    getDevices,
], (astrometryIds, camerasIds, telescopesIds, devices) => ({
    astrometryDrivers: filterDevices(devices, astrometryIds),
    telescopes: filterDevices(devices, telescopesIds),
    cameras:    filterDevices(devices, camerasIds),
}))

export const plateSolvingContainerSelector = createSelector([
    getPlateSolvingDevices,
    getMessages,
    getPlateSolvingOptions,
    getSolution,
    state => state.plateSolving.loading,
], (plateSolvingDevices, messages, options, solution, loading) => ({
    ...plateSolvingDevices,
    messages: messages[options.astrometryDriver],
    options,
    solution,
    loading,
    isManualFOV: options[PlateSolving.Options.fovSource] === 'manual',
}));

export const plateSolvingSectionMenuSelector = createSelector([getPlateSolvingOptions], options => ({
    listenToCamera: options[PlateSolving.Options.camera],
}))

export const solveFromCameraSelector = createSelector([getPlateSolvingOptions], options => ({options}));

export const plateSolvingPageContainerSelector = createSelector([getConnectedAstrometry, getConnectedTelescopes], (astrometryDrivers, telescopes) => ({
    hasAstrometry: astrometryDrivers.length > 0,
    hasTelescopes: telescopes.length > 0,
}));

