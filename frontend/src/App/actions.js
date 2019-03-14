import { fetchBackendVersion } from '../middleware/api';
import listenToEvents from '../middleware/events';
import { isError } from '../Errors/selectors.js';
import Actions from '../actions';

let retryTimer = null;

export const serverError = (source, payloadType, payload, responseBody) => dispatch => {
    dispatch({ type: 'SERVER_ERROR', source, payloadType, payload, responseBody });
    retryTimer = setTimeout(() => dispatch(init()), 1000);
};

export const getBackendVersion = () => dispatch => fetchBackendVersion(dispatch, version => dispatch({ type: 'BACKEND_VERSION_FETCHED', version }));

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
    listenToEvents(dispatch);
}