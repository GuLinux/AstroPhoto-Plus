import { combineReducers } from 'redux'
import devices from './devices'
import sequences from './sequences'
import sessions from './sessions'
import network from './network'
import navigation from './navigation'
import indiserver from './indiserver'

const indiLiteApp = combineReducers({devices, sequences, sessions, network, navigation, indiserver});

export default indiLiteApp
