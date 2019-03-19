import { fetchBackendVersion } from '../middleware/api';
import listenToEvents from '../middleware/events';
import { isError } from '../Errors/selectors.js';
import Actions from '../actions';
import { getAutoguidingStatus } from '../Autoguiding/actions';
import { getFrontendVersion } from './selectors';
import { addNotification } from '../Notifications/actions';
import { get } from 'lodash';

let retryTimer = null;

export const serverError = (source, payloadType, payload, responseBody) => dispatch => {
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
    dispatch(Actions.INDIService.fetchService());
    dispatch(Actions.INDIService.fetchProfiles());
    dispatch(Actions.Commands.get());
    //dispatch(getAutoguidingStatus());
    listenToEvents(dispatch);
}