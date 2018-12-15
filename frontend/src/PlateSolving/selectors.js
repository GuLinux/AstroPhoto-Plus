import { createSelector } from 'reselect';
import {
    filterDevices,
    getConnectedAstrometry,
    getConnectedCameras,
    getConnectedTelescopes,
} from '../Gear/selectors';
import { getMessages, getDevices, getValueInputSelector} from '../INDI-Server/selectors';
import { PlateSolving } from './actions';
import { get } from 'lodash';

const getPlateSolvingOptions = state => state.plateSolving.options;
const getOption = (state, option) => getPlateSolvingOptions(state)[option];

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


const getDeviceId = (deviceOptionName, state) => getOption(state, deviceOptionName);

export const plateSolvingContainerSelector = createSelector([
    getPlateSolvingDevices,
    getMessages,
    getPlateSolvingOptions,
    getSolution,
    state => state.plateSolving.loading,
    state => getValueInputSelector(getDeviceId(PlateSolving.Options.fovSource, state), 'CCD_INFO', 'CCD_MAX_X')(state),
    state => getValueInputSelector(getDeviceId(PlateSolving.Options.fovSource, state), 'CCD_INFO', 'CCD_PIXEL_SIZE_X')(state),
    state => getValueInputSelector(getDeviceId(PlateSolving.Options.telescope, state), 'TELESCOPE_INFO', 'TELESCOPE_FOCAL_LENGTH')(state),
], (plateSolvingDevices, messages, options, solution, loading, ccdMaxX, ccdPixelSizeX, telescopeFocalLength) => ({
    ...plateSolvingDevices,
    messages: messages[options.astrometryDriver],
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

export const plateSolvingPageContainerSelector = createSelector([getConnectedAstrometry, getConnectedTelescopes], (astrometryDrivers, telescopes) => ({
    hasAstrometry: astrometryDrivers.length > 0,
    hasTelescopes: telescopes.length > 0,
}));

