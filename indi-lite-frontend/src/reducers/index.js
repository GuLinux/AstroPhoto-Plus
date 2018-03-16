import { combineReducers } from 'redux'
import sequences from './sequences'
import sessions from './sessions'
import network from './network'
import navigation from './navigation'
import indiserver from './indiserver'
import notifications from './notifications'

const indiLiteApp = combineReducers({sequences, sessions, network, navigation, indiserver, notifications });

export default indiLiteApp
