import { combineReducers } from 'redux'
import devices from './devices'
import sequences from './sequences'

const indiLiteApp = combineReducers({devices, sequences});

export default indiLiteApp
