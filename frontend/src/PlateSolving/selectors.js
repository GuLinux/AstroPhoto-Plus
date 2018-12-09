import { createSelector } from 'reselect';
import { transform, get} from 'lodash';
import {
    filterDevices,
    getConnectedAstrometry,
    getConnectedCameras,
    getConnectedTelescopes,
} from '../Gear/selectors';
import { getMessages, getDevices, indiValueSelectorByName, getValues } from '../INDI-Server/selectors-redo';
import { getValueId } from '../INDI-Server/utils';
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


const getCCDInfoSelector = (value) => createSelector([getPlateSolvingOptions, getValues], (options, values) => {
    const fovSource = options[PlateSolving.Options.fovSource];
    return fovSource && fovSource !== 'manual' && values.entities[getValueId({name: 'CCD_INFO', device: fovSource}, {name: value})].value;
});

const getTelescopeFocalLength = createSelector([getPlateSolvingOptions, getValues], (options, values) => {
    const telescope = options[PlateSolving.Options.telescope];
    const valueId = getValueId({name: 'TELESCOPE_INFO', device: telescope}, {name: 'TELESCOPE_FOCAL_LENGTH'});
    return telescope && values.entities[valueId].value;
});



export const plateSolvingContainerSelector = createSelector([
    getPlateSolvingDevices,
    getMessages,
    getPlateSolvingOptions,
    getSolution,
    state => state.plateSolving.loading,
    getCCDInfoSelector('CCD_MAX_X'),
    getCCDInfoSelector('CCD_PIXEL_SIZE_X'),
    getTelescopeFocalLength,
], (plateSolvingDevices, messages, options, solution, loading, ccdMaxX, ccdPixelSizeX, telescopeFocalLength) => ({
    ...plateSolvingDevices,
    messages: messages[options.astrometryDriver],
    options,
    solution,
    loading,
    isManualFOV: options[PlateSolving.Options.fovSource] === 'manual',
    ccdInfo: {
        ccdMaxX,
        ccdPixelSizeX,
    },
    telescopeFocalLength,
}));

export const plateSolvingSectionMenuSelector = createSelector([getPlateSolvingOptions], options => ({
    listenToCamera: options[PlateSolving.Options.camera],
}))

export const solveFromCameraSelector = createSelector([getPlateSolvingOptions], options => ({options}));

export const plateSolvingPageContainerSelector = createSelector([getConnectedAstrometry, getConnectedTelescopes], (astrometryDrivers, telescopes) => ({
    hasAstrometry: astrometryDrivers.length > 0,
    hasTelescopes: telescopes.length > 0,
}));

