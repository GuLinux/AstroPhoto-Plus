import Sequences from './Sequences/actions'
import SequenceItems from './SequenceItems/actions'
import Navigation from './Navigation/actions'
import INDIServer from './INDI-Server/actions'
import Notifications from './Notifications/actions'
import Gear from './Gear/actions'
import INDIService from './INDI-Service/actions'

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
