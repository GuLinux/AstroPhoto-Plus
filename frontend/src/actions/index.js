import Sequences from './sequences'
import SequenceItems from './sequenceitems'
import Navigation from './navigation'
import INDIServer from './indiserver'
import Notifications from './notifications'
import Gear from './gear'
import INDIService from './indiservice'

export const Actions = {
    Sequences,
    SequenceItems,
    Navigation,
    INDIServer,
    Notifications,
    Gear,
    serverError: (source, payloadType, payload, responseBody) => ({ type: 'SERVER_ERROR', source, payloadType, payload, responseBody }),
    INDIService,
}

export default Actions
