import { createSelector } from 'reselect';
import {
    filterDevices,
    getConnectedCameras,
    getConnectedTelescopes,
    getCCDWidthPix,
    getCCDPixelPitch,
    getTelescopeFocalLength,
} from '../Gear/selectors';
import { getDevices } from '../INDI-Server/selectors';
import { PlateSolving } from './actions';
import { get } from 'lodash';
import { formatDecimalNumber } from '../utils';

const getPlateSolvingOptions = state => state.plateSolving.options;
const getOption = (state, option) => getPlateSolvingOptions(state)[option];

const getSolution = state => state.plateSolving.solution;
const getPreviousSolution = state => state.plateSolving.previousSolution;


const getPlateSolvingDevices = createSelector([
    getConnectedCameras,
    getConnectedTelescopes,
    getDevices,
], (camerasIds, telescopesIds, devices) => ({
    telescopes: filterDevices(devices, telescopesIds),
    cameras:    filterDevices(devices, camerasIds),
}))


const getDeviceId = (deviceOptionName, state) => getOption(state, deviceOptionName);

// Formatting solution utils
const deg2hours = deg => deg * (24.0 / 360.0);

const toSexagesimal = value => {
    const degrees = parseInt(value);
    let remainder = Math.abs(60 * (value - degrees));
    const minutes = parseInt(remainder);
    remainder = 60 * (remainder - minutes);
    const seconds = parseInt(remainder);
    return { degrees, minutes, seconds, fractionalSeconds: remainder };
}

const formatDegrees = degrees => {
    const sexagesimal = toSexagesimal(degrees);
    return `${sexagesimal.degrees}\u00B0 ${sexagesimal.minutes}' ${formatDecimalNumber('%0.2f', sexagesimal.fractionalSeconds)}"`;
}


const formatRA = degrees => {
    const hours = deg2hours(degrees);
    const sexagesimal = toSexagesimal(hours);
    return `${sexagesimal.degrees}:${sexagesimal.minutes}:${formatDecimalNumber('%0.2f', sexagesimal.fractionalSeconds)}`;
}

const formatAladinParams = (solution) => {
    const ra = toSexagesimal(solution.ASTROMETRY_RESULTS_RA.value * (24.0 / 360.0));
    const dec = toSexagesimal(solution.ASTROMETRY_RESULTS_DE.value);
    const decSign = dec.degrees >= 0 ? '%2B' : ''
    return 'target=' +
        encodeURI(`${ra.degrees} ${ra.minutes} ${formatDecimalNumber('%0.3f', ra.fractionalSeconds)}`) +
        decSign + encodeURI(`${dec.degrees} ${dec.minutes} ${formatDecimalNumber('%0.2f', dec.fractionalSeconds)}`) +
        '&fov=' + encodeURI(formatDecimalNumber('%0.2f', solution.ASTROMETRY_RESULTS_WIDTH.value * 5));
}





const transformSolution = solution => ({
    ra: deg2hours(solution.ASTROMETRY_RESULTS_RA.value),
    raj2000: deg2hours(solution.ASTROMETRY_RESULTS_RA.value),
    dec: solution.ASTROMETRY_RESULTS_DE.value,
    dej2000: solution.ASTROMETRY_RESULTS_DE.value,
    raLabel: formatRA(solution.ASTROMETRY_RESULTS_RA.value),
    decLabel: formatDegrees(solution.ASTROMETRY_RESULTS_DE.value),
    widthDegrees: solution.ASTROMETRY_RESULTS_WIDTH.value,
    heightDegrees: solution.ASTROMETRY_RESULTS_HEIGHT.value,
    width: formatDegrees(solution.ASTROMETRY_RESULTS_WIDTH.value),
    height: formatDegrees(solution.ASTROMETRY_RESULTS_HEIGHT.value),
    pixScale: formatDecimalNumber('%0.2f', solution.ASTROMETRY_RESULTS_PIXSCALE.value),
    orientation: formatDecimalNumber('%0.2f', solution.ASTROMETRY_RESULTS_ORIENTATION.value),
    aladinURL: `http://aladin.unistra.fr/AladinLite/?${formatAladinParams(solution)}&survey=P/DSS2/color`,
});

const solution2Target = target => ({
    ...transformSolution(target),
    id: target.id,
    displayName: `File: ${target.id}`,
    type: 'solution',
});

export const getPlateSolvingTargets = createSelector([state => state.plateSolving.targets], targets => targets.map(target => 'ASTROMETRY_RESULTS_RA' in target ? solution2Target(target) : target));
export const getPlateSolvingMainTarget = state => state.plateSolving.mainTarget;

export const plateSolvingContainerSelector = createSelector([
    getPlateSolvingDevices,
    getPlateSolvingOptions,
    getSolution,
    getPreviousSolution,
    state => state.plateSolving.loading,
    state => state.plateSolving.messages,
    state => getCCDWidthPix(state, {cameraId: getDeviceId(PlateSolving.Options.fovSource, state)}),
    state => getCCDPixelPitch(state, {cameraId: getDeviceId(PlateSolving.Options.fovSource, state)}),
    state => getTelescopeFocalLength(state, {telescopeId: getDeviceId(PlateSolving.Options.telescope, state)}),
    getPlateSolvingTargets,
    getPlateSolvingMainTarget,
], (plateSolvingDevices, options, solution, previousSolution, loading, messages, ccdMaxX, ccdPixelSizeX, telescopeFocalLength, targets, mainTarget) => ({
    ...plateSolvingDevices,
    messages,
    options,
    solution: solution && transformSolution(solution),
    previousSolution: previousSolution && transformSolution(previousSolution),
    loading,
    isManualFOV: options[PlateSolving.Options.fovSource] === 'manual',
    ccdInfo: {
        ccdMaxX: get(ccdMaxX, 'value'),
        ccdPixelSizeX: get(ccdPixelSizeX, 'value'),
    },
    telescopeFocalLength: get(telescopeFocalLength, 'value'),
    targets,
    mainTarget,
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

