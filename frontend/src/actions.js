import Sequences from './Sequences/actions';
import SequenceItems from './SequenceItems/actions';
import INDIServer from './INDI-Server/actions';
import Notifications from './Notifications/actions';
import Gear from './Gear/actions';
import INDIService from './INDI-Service/actions';
import Camera from './Camera/actions';
import Settings from './Settings/actions';
import Image from './Image/actions';
import Navigation from './Navigation/actions';
import Commands from './Commands/actions';
import { fetchBackendVersion } from './middleware/api';

export const Actions = {
    Sequences,
    SequenceItems,
    INDIServer,
    Notifications,
    Gear,
    serverError: (source, payloadType, payload, responseBody) => ({ type: 'SERVER_ERROR', source, payloadType, payload, responseBody }),
    INDIService,
    Camera,
    Settings,
    Image,
    Navigation,
    Commands,
    fetchBackendVersion: () => dispatch => fetchBackendVersion(dispatch, version => dispatch({ type: 'BACKEND_VERSION_FETCHED', version })), 
}

export default Actions
