import { combineReducers } from 'redux'
import devices from './devices'
import sequences from './sequences'
import sessions from './sessions'
import network from './network'
import navigation from './navigation'

const indiLiteApp = combineReducers({devices, sequences, sessions, network, navigation});

export default indiLiteApp
