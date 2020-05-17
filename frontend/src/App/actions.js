import { fetchBackendVersion, fetchBackendTimestampAPI, setBackendTimestampAPI } from '../middleware/api';
import listenToEvents from '../middleware/events';
import { isError } from '../Errors/selectors.js';
import Actions from '../actions';
import { getFrontendVersion } from './selectors';
import { addNotification } from '../Notifications/actions';
import { get } from 'lodash';
import { getAvailableCatalogs, getCatalogs } from '../Catalogs/actions';
import { getPHD2Status } from '../PHD2/actions';
import { getNetworkManagerStatus } from '../Settings/actions';

let retryTimer = null;

export const serverError = (source, payloadType, payload, responseBody) => dispatch => {
    console.error(source, payloadType, payload, responseBody);
    dispatch({ type: 'SERVER_ERROR', source, payloadType, payload, responseBody });
    retryTimer = setTimeout(() => dispatch(init()), 1000);
};

export const getBackendVersion = () => (dispatch, getState) => {
    return fetchBackendVersion(dispatch, version => {
        dispatch({ type: 'BACKEND_VERSION_FETCHED', version });
        const frontendVersion = getFrontendVersion(getState());
        const backendVersion = get(version, 'version');
        if(backendVersion && frontendVersion !== backendVersion) {
            dispatch(addNotification(
                'Version mismatch',
                `Your backend version (${backendVersion}) is different from your frontend version (${frontendVersion}). Please reload the app`,
                'warning',
            ));
        }
    });
}

export const dismissTimeSyncModal = () => ({ type: 'TIME_SYNC_MODAL_DISMISS' });

const receivedBackendTimestamp = payload => ({ type: 'BACKEND_TIMESTAMP_FETCHED', payload });

export const backendTimeSync = () => dispatch => {
    dispatch(dismissTimeSyncModal());
    setBackendTimestampAPI(dispatch, { utc_timestamp: new Date().getTime() / 1000.0 }, receivedBackendTimestamp, () => dispatch(addNotification('Time Synchronisation failed', 'Failed to set time on backend server', 'warning', 5000)) );
};

export const getBackendTimestamp = () => dispatch => fetchBackendTimestampAPI(dispatch, payload => dispatch(receivedBackendTimestamp(payload)));

export const init = () => async (dispatch, getState) => {
    if(retryTimer) {
        clearTimeout(retryTimer);
    }
    const address = await Actions.BackendSelection.getAddress(dispatch);
    if(address === null) {
        console.log('No backend address found');
        return;
    }
    await dispatch(getBackendVersion());
    if(isError(getState())) {
        console.log('error getting state')
        return;
    }
    await dispatch(Actions.Settings.fetch());
    await dispatch(Actions.INDIServer.fetchServerState(true));
    await dispatch(Actions.INDIServer.autoconnectServer());
    dispatch(Actions.Sequences.fetch());
    dispatch(Actions.PlateSolving.getStatus());
    dispatch(Actions.INDIService.fetchService());
    dispatch(Actions.INDIService.fetchProfiles());
    dispatch(Actions.Commands.get());
    dispatch(getAvailableCatalogs());
    dispatch(getCatalogs());
    dispatch(getPHD2Status());
    dispatch(getNetworkManagerStatus());
    dispatch(getBackendTimestamp());
    listenToEvents(dispatch);
}
