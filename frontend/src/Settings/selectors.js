import { createSelector } from 'reselect';
import { get } from 'lodash';
import { getConnectedCameras, getConnectedTelescopes, getCCDWidthPix, getCCDPixelPitch, getTelescopeFocalLength } from '../Gear/selectors';
import { getBackendVersion, getFrontendVersion } from '../App/selectors';
import { getDownloadableCatalogs, getCurrentCatalogs, getCatalogImportingStatus } from '../Catalogs/selectors';

export const getSettings = state => state.settings;
export const getCurrentSettings = state => getSettings(state).current;
const getCommands = state => state.commands;

const getAstrometryIsDownloading = state => state.settings.astrometry.isDownloading;

export const getServerName = state => get(state, 'settings.current.server_name', '');

export const settingsSelector = createSelector([
    getSettings,
    getBackendVersion,
    getFrontendVersion,
    getCommands,
    getAstrometryIsDownloading,
    getCurrentCatalogs,
    getDownloadableCatalogs,
    getCatalogImportingStatus,
], (settings, backendVersion, frontendVersion, commands, astrometryIsDownloading, catalogs, availableCatalogs, catalogsImporting) => ({
    settings,
    backendVersion,
    frontendVersion,
    showCommands: commands.ids.length > 0 || commands.fetching,
    astrometryIsDownloading,
    catalogs,
    availableCatalogs,
    catalogsImporting,
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
