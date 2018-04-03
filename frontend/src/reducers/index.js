import { combineReducers } from 'redux'
import sequenceItems from './sequenceitems'
import sequences from './sequences'
import network from './network'
import navigation from './navigation'
import indiserver from './indiserver'
import notifications from './notifications'
import gear from './gear'
import errors from './errors'

const indiLiteApp = combineReducers({sequenceItems, sequences, network, navigation, indiserver, notifications, errors, gear });

export default indiLiteApp
