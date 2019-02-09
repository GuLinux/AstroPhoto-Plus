import { get } from 'lodash';

const defaultState = {
    current: {},
    pending: {},
    astrometry: {
        isDownloading: false,
    },
};


const settingsUpdated = (state, settings) => {
    const pending = {...state.pending };
    Object.keys(settings).forEach(k => delete pending[k]);
    return {
        current: {...state.current, ...settings },
        pending,
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
            ...get(state.astrometry, 'errors', []),
            { file, errorMessage },
        ]
    }
});

const settings = (state = defaultState, action) => {
    switch(action.type) {
        case 'SETTINGS_RECEIVED':
            return action.settings ? {...state, current: action.settings } : state;
        case 'SETTINGS_SET_PENDING':
            return {...state, pending: {...state.pending, [action.key]: action.value === state.current[action.key] ? undefined : action.value }};
        case 'SETTINGS_RESET_PENDING':
            return {...state, pending: {...state.pending, [action.key]: undefined }};
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
