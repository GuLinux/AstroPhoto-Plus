import {
    getSettingsApi,
    updateSettingsApi,
    downloadAstrometryIndexesApi,
    getNetworkManagerStatusAPI,
    getNetworkManagerAccessPointsAPI,
    networkManagerAddWifiAPI,
    networkManagerActivateConnectionAPI,
    networkManagerDeactivateConnectionAPI,
    networkManagerRemoveConnectionAPI,
    networkManagerUpdateWifiAPI,
} from '../middleware/api'
import Actions from '../actions';

export const update = (settings) => dispatch => {
    dispatch({ type: 'UPDATE_SETTINGS', settings });
    return updateSettingsApi(dispatch, settings, data => dispatch(Settings.updated(data)) );
};

export const receivedNetworkManagerStatus = status => ({ type: 'NETWORK_MANAGER_STATUS', status });

export const getNetworkManagerStatus = () => dispatch => {
    dispatch({ type: 'NETWORK_MANAGER_FETCHING_STATUS' });
    return getNetworkManagerStatusAPI(dispatch,
        status => dispatch(receivedNetworkManagerStatus(status)),
    );
};

export const getNetworkManagerAccessPoints = () => dispatch => getNetworkManagerAccessPointsAPI(
    dispatch,
    accessPoints => dispatch({ type: 'NETWORK_MANAGER_RECEIVED_ACCESS_POINTS', accessPoints }),
);

export const networkManagerAddWifi = ({ssid, psk, autoconnect, priority, isAccessPoint, id}) => dispatch => networkManagerAddWifiAPI(
    dispatch,
    {
        ssid,
        psk,
        autoconnect,
        priority,
        isAccessPoint,
        id,
    },
    result => dispatch({ type: 'NETWORK_MANAGER_WIFI_ADDED', result }),
);

export const networkManagerUpdateWifi = ({id, ssid, psk, autoconnect, priority, isAccessPoint, rename}) => dispatch => networkManagerUpdateWifiAPI(
    dispatch,
    {
        rename,
        ssid,
        psk,
        autoconnect,
        priority,
        isAccessPoint,
        id,
    },
    result => dispatch({ type: 'NETWORK_MANAGER_WIFI_UPDATED', result }),
);



export const networkManagerActivateConnection = connection => dispatch => networkManagerActivateConnectionAPI(
    dispatch,
    connection,
    result => dispatch({ type: 'NETWORK_MANAGER_CONNECTION_ACTIVATING', result }),
);

export const networkManagerDeactivateConnection = connection => dispatch => networkManagerDeactivateConnectionAPI(
    dispatch,
    connection,
    result => dispatch({ type: 'NETWORK_MANAGER_CONNECTION_DEACTIVATING', result }),
);

export const networkManagerRemoveConnection = connection => dispatch => networkManagerRemoveConnectionAPI(
    dispatch,
    connection,
    result => dispatch({ type: 'NETWORK_MANAGER_CONNECTION_REMOVING', result }),
);





const Settings = {
    received: (settings) => ({ type: 'SETTINGS_RECEIVED', settings}),
    updated: (settings) => ({ type: 'SETTINGS_UPDATED', settings}),

    fetch: () => {
        return dispatch => {
            dispatch({type: 'REQUEST_SETTINGS'});
            return getSettingsApi( dispatch, data => dispatch(Settings.received(data)) );
        }
    },

    update,
    downloadIndexes: arcminutes => dispatch => {
        downloadAstrometryIndexesApi(dispatch, arcminutes,
            () => dispatch({ type: 'SETTINGS_DOWNLOAD_ASTROMETRY_INDEXES' }),
            () => dispatch(Actions.Notifications.add('Error', 'An error occured downloading astrometry indexes. Please look server logs for details', 'error'))
        );
    },

    downloadIndexesProgress: ({file, downloaded, total, all_downloaded, all_total}) => ({
        type: 'SETTINGS_DOWNLOAD_ASTROMETRY_INDEXES_PROGRESS',
        file,
        downloaded,
        total,
        allDownloaded: all_downloaded,
        allTotal: all_total,
    }),

    downloadIndexesError: ({file, error_message}) => ({
            type: 'SETTINGS_DOWNLOAD_ASTROMETRY_INDEXES_ERROR',
            file,
            errorMessage: error_message,
    }),

    downloadIndexesFinished: () => ({
        type: 'SETTINGS_DOWNLOAD_ASTROMETRY_INDEXES_FINISHED',
    }),

    resetAstrometryDownloadIndexesStatus: () => ({
        type: 'SETTINGS_DOWNLOAD_ASTROMETRY_INDEXES_RESET',
    }),
};

export default Settings;

