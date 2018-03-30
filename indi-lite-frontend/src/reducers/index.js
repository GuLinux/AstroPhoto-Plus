import { combineReducers } from 'redux'
import sequences from './sequences'
import sessions from './sessions'
import network from './network'
import navigation from './navigation'
import indiserver from './indiserver'
import notifications from './notifications'
import gear from './gear'
import errors from './errors'

const indiLiteApp = combineReducers({sequences, sessions, network, navigation, indiserver, notifications, errors, gear });

export default indiLiteApp
