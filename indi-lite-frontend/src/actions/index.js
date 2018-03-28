import Sessions from './sessions'
import Sequences from './sequences'
import Navigation from './navigation'
import INDIServer from './indiserver'
import Notifications from './notifications'

export const Actions = {
    Sessions,
    Sequences,
    Navigation,
    INDIServer,
    Notifications,
    serverError: (source, payloadType, payload, responseBody) => ({ type: 'SERVER_ERROR', source, payloadType, payload, responseBody }),
}

export default Actions
