import Sequences from './Sequences/actions';
import SequenceJobs from './SequenceJobs/actions';
import INDIServer from './INDI-Server/actions';
import Notifications from './Notifications/actions';
import INDIService from './INDI-Service/actions';
import Camera from './Camera/actions';
import Settings from './Settings/actions';
import Image from './Image/actions';
import Navigation from './Navigation/actions';
import Commands from './Commands/actions';
import { PlateSolving } from './PlateSolving/actions';
import { fetchBackendVersion } from './middleware/api';
import listenToEvents from './middleware/events';

const Server = {
    error: (source, payloadType, payload, responseBody) => ({ type: 'SERVER_ERROR', source, payloadType, payload, responseBody }),
    fetchBackendVersion: () => dispatch => fetchBackendVersion(dispatch, version => dispatch({ type: 'BACKEND_VERSION_FETCHED', version })), 

};

const init = () => async (dispatch) => {
    await dispatch(Actions.Server.fetchBackendVersion());
    await dispatch(Actions.Settings.fetch());
    await dispatch(Actions.INDIServer.fetchServerState(true));
    await dispatch(Actions.INDIServer.autoconnectServer());
    dispatch(Actions.Sequences.fetch());
    dispatch(Actions.INDIService.fetchService());
    dispatch(Actions.INDIService.fetchProfiles());
    dispatch(Actions.Commands.get());
    listenToEvents(dispatch);
}

export const Actions = {
    Sequences,
    SequenceJobs,
    INDIServer,
    Notifications,
    INDIService,
    Camera,
    Settings,
    Image,
    Navigation,
    Commands,
    PlateSolving,
    Server,
    init,
}

export default Actions
