import { createSelector } from 'reselect';
import { get } from 'lodash';

export const getSettings = state => state.settings;
export const getCurrentSettings = state => getSettings(state).current;
const getVersion = state => get(state, 'version.version');
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
], (astrometry) => ({
    ...astrometry,
    showProgress: astrometry.isDownloading || astrometry.isFinished,
    currentFileError: astrometry.errors && astrometry.errors.find(e => e.file === astrometry.currentFile),
}));