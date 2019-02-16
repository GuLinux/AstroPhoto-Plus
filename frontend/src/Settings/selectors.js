import { createSelector } from 'reselect';
import { get } from 'lodash';
import { getConnectedCameras, getConnectedTelescopes, getCCDWidthPix, getCCDPixelPitch, getTelescopeFocalLength } from '../Gear/selectors';

export const getSettings = state => state.settings;
export const getCurrentSettings = state => getSettings(state).current;
const getVersion = state => get(state, 'version.backend.version');
const getCommands = state => state.commands;

const getAstrometryIsDownloading = state => state.settings.astrometry.isDownloading;

export const settingsSelector = createSelector([
    getSettings,
    getVersion,
    getCommands,
    getAstrometryIsDownloading,
], (settings, version, commands, astrometryIsDownloading) => ({
    settings,
    version,
    showCommands: commands.ids.length > 0 || commands.fetching,
    astrometryIsDownloading,
}));

export const downloadIndexesSelector = createSelector([
    state => state.settings.astrometry,
    getConnectedCameras,
    getConnectedTelescopes,
], (
    astrometry,
    cameras,
    telescopes,
    ) => ({
    ...astrometry,
    showProgress: astrometry.isDownloading || astrometry.isFinished,
    currentFileError: astrometry.errors && astrometry.errors.find(e => e.file === astrometry.currentFile),
    cameras,
    telescopes,
}));

export const cameraDropdownItemSelector = createSelector([
    getCCDWidthPix,
    getCCDPixelPitch,
], ({ value: cameraPixelWidth}, {value: cameraPixelPitch}) => ({
    cameraPixelPitch,
    cameraPixelWidth,
}));

export const telescopeDropdownItemSelector = createSelector([getTelescopeFocalLength], ({value: focalLength}) => ({focalLength}));