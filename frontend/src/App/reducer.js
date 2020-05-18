import PackageInfo from '../../package.json';
 
const defaultState = {
    frontend: { version: PackageInfo.version },
    backend: {},
    timeSyncNeeded: false,
    timeSyncModalDismissed: false,
};

export const app = (state = defaultState, action) => {
    switch (action.type) {
        case 'BACKEND_VERSION_FETCHED':
            return { ...state, backend: action.version };
        case 'TIME_SYNC_MODAL_DISMISS':
            return {...state, timeSyncModalDismissed: true };
        case 'BACKEND_TIMESTAMP_FETCHED':
            return { ...state, timeSyncNeeded: Math.abs( (new Date().getTime() / 1000.0) - action.payload.utc_timestamp ) > 30 };
        default:
            return state;
    }
}


