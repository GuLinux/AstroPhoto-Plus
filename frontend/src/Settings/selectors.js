import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import { get, getOr, set } from 'lodash/fp';
import { getConnectedCameras, getConnectedTelescopes, getCCDWidthPix, getCCDPixelPitch, getTelescopeFocalLength } from '../Gear/selectors';
import { getBackendVersion, getFrontendVersion } from '../App/selectors';
import { getDownloadableCatalogs, getCurrentCatalogs, getCatalogImportingStatus } from '../Catalogs/selectors';

export const getSettings = state => state.settings;
export const getCurrentSettings = state => getSettings(state).current;

export const getCurrentSetting = (state, {setting}) => get(setting, getCurrentSettings(state));

const getCommands = state => state.commands;

const getAstrometryIsDownloading = state => state.settings.astrometry.isDownloading;

export const getServerName = state => getOr('', 'settings.current.server_name', state);
export const getAutoguiderEngine = state => getOr('off', 'settings.current.autoguider_engine', state);

const networkManagerConnections = state => state.settings.networkManager.connections;
const networkManagerActiveConnections = state => state.settings.networkManager.activeConnections;


const settingSelectorKey = (state, {setting}) => setting;
export const getSettingSelector = createCachedSelector(getCurrentSetting, (currentValue) => ({
    currentValue,
}))(settingSelectorKey);


export const getCheckboxSettingSelector = createCachedSelector(getCurrentSetting, (currentValue) => {
    const checked = (currentValue || 0) !== 0
    return { checked };
})(settingSelectorKey);

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


export const networkManagerSelector = createSelector([networkManagerConnections, networkManagerActiveConnections],
    (connections, activeConnections) => {
        let activeConnectionIds = activeConnections.map(c => c.id);
        let networks = connections.map(c => set('active', activeConnectionIds.includes(c.id), c));
        return { networks };
    }
);
