import { set, get, getOr } from 'lodash/fp';

const defaultState = {
    current: {},
    astrometry: {
        isDownloading: false,
    },
    networkManager: {
        autoAccessPointSSID: '',
        loading: false,
        connections: [],
        activeConnections: [],
        accessPoints: {},
    },
};

const networkLoading = (state, loading) => set('networkManager.loading', loading, state);

const networkUpdated = (state, {connections, activeConnections, autoAccessPointSSID}) => {
    let newState = set('networkManager.connections', connections, networkLoading(state, false));
    newState = set('networkManager.autoAccessPointSSID', autoAccessPointSSID, newState);
    return set('networkManager.activeConnections', activeConnections, newState);
}

const mergeNetworkManagerAccessPoints = (state, action) => {
    let newState = state;
    action.accessPoints.forEach(ap => newState = set(['networkManager', 'accessPoints', ap.ssid], ap, newState));
    return newState;
}


const settingsUpdated = (state, settings) => {
    return {
        ...state,
        current: {...state.current, ...settings },
    }
}

const astrometryIndexesDownloadProgress = (state, {file, downloaded, total, allDownloaded, allTotal}) => ({
    ...state,
    astrometry: {
        ...state.astrometry,
        currentFile: file,
        downloaded,
        total,
        allDownloaded,
        allTotal,
    },
})

const appendAstrometryIndexDownloadError = (state, {file, errorMessage }) => ({
    ...state,
    astrometry: {
        ...state.astrometry,
        errors: [
            ...getOr([], 'errors', state.astrometry),
            { file, errorMessage },
        ]
    }
});

const settings = (state = defaultState, action) => {
    switch(action.type) {
        case 'NETWORK_MANAGER_CLEAR_ACCESS_POINTS':
            return set('networkManager.accessPoints', {}, state);
        case 'NETWORK_MANAGER_RECEIVED_ACCESS_POINTS':
            return mergeNetworkManagerAccessPoints(state, action);
        case 'NETWORK_MANAGER_FETCHING_STATUS':
            return networkLoading(state, true);
        case 'NETWORK_MANAGER_STATUS':
            return networkUpdated(state, action.status);
        case 'SETTINGS_RECEIVED':
            return action.settings ? {...state, current: action.settings } : state;
        case 'SETTINGS_UPDATED':
            return settingsUpdated(state, action.settings);
        case 'SETTINGS_DOWNLOAD_ASTROMETRY_INDEXES':
            return {...state, astrometry: { isDownloading: true } };
        case 'SETTINGS_DOWNLOAD_ASTROMETRY_INDEXES_PROGRESS':
            return astrometryIndexesDownloadProgress(state, action);
        case 'SETTINGS_DOWNLOAD_ASTROMETRY_INDEXES_ERROR':
            return appendAstrometryIndexDownloadError(state, action);
        case 'SETTINGS_DOWNLOAD_ASTROMETRY_INDEXES_FINISHED':
            return {...state, astrometry: {...state.astrometry, isDownloading: false, isFinished: true}};
        case 'SETTINGS_DOWNLOAD_ASTROMETRY_INDEXES_RESET':
            return {...state, astrometry: { isDownloading: false }};
        default:
            return state;
    }
}

export default settings;
