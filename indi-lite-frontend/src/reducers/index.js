import { combineReducers } from 'redux'
import devices from './devices'
import sequences from './sequences'
import sessions from './sessions'

const indiLiteApp = combineReducers({devices, sequences, sessions});

export default indiLiteApp
