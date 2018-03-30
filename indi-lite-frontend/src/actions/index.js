import Sessions from './sessions'
import Sequences from './sequences'
import Navigation from './navigation'
import INDIServer from './indiserver'
import Notifications from './notifications'
import Gear from './gear'

export const Actions = {
    Sessions,
    Sequences,
    Navigation,
    INDIServer,
    Notifications,
    Gear,
    serverError: (source, payloadType, payload, responseBody) => ({ type: 'SERVER_ERROR', source, payloadType, payload, responseBody }),
}

export default Actions
