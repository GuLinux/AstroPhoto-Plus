import { combineReducers } from 'redux'
import devices from './devices'
import sequences from './sequences'
import sessions from './sessions'
import network from './network'

const indiLiteApp = combineReducers({devices, sequences, sessions, network});

export default indiLiteApp
