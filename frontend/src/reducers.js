import { combineReducers } from 'redux';
import sequenceJobs from './SequenceJobs/reducer';
import sequences from './Sequences/reducer';
import indiserver from './INDI-Server/reducer';
import notifications from './Notifications/reducer';
import gear from './Gear/reducer';
import errors from './Errors/reducer';
import indiservice from './INDI-Service/reducer';
import camera from './Camera/reducer';
import settings from './Settings/reducer';
import image from './Image/reducer';
import navigation from './Navigation/reducer';
import commands from './Commands/reducer';

const network = (state = { fetching: false }, action) => {
    switch(action.type) {
        case 'REQUEST_SESSIONS':
        case 'REQUEST_ADD_SESSION':
        case 'REQUEST_ADD_SEQUENCE':
        case 'FETCH_INDI_DEVICE_PROPERTIES':
        case 'FETCH_INDI_DEVICES':
        case 'FETCH_INDI_SERVER_STATE':
        case 'CONNECT_INDI_SERVER':
        case 'DISCONNECT_INDI_SERVER':
        case 'FETCH_CAMERAS':
        case 'DUPLICATE_SEQUENCE_REQUESTED':
        case 'START_SEQUENCE_REQUESTED':
        case 'REQUEST_SEQUENCE_ITEM_MOVE':
        case 'REQUEST_SEQUENCE_ITEM_DUPLICATE':
        case 'REQUEST_SAVE_SEQUENCE_ITEM':
        case 'FETCH_INDI_SERVICE':
        case 'UPDATE_SETTINGS':
//        case 'COMMIT_PENDING_PROPERTIES':
            return {...state, fetching: true };
        case 'RECEIVE_SESSIONS':
        case 'SESSION_CREATED':
        case 'SEQUENCE_CREATED':
        case 'RECEIVED_SERVER_STATE':
        case 'RECEIVED_INDI_DEVICES':
        case 'RECEIVED_DEVICE_PROPERTIES':
        case 'SERVER_ERROR':
        case 'RECEIVED_CAMERAS':
        case 'RECEIVED_START_SEQUENCE_REPLY':
        case 'RESPONSE_ERROR':
        case 'SEQUENCE_ITEM_UPDATED':
        case 'SEQUENCE_UPDATED':
        case 'REQUEST_SAVE_SEQUENCE_ITEM_ERROR':
        case 'RECEIVED_INDI_SERVICE':
        case 'SETTINGS_UPDATED':
//        case 'COMMITTED_PENDING_PROPERTIES':
            return {...state, fetching: false};
        default:
            return state;
    }
}

const version = (state = {}, action) => {
    switch(action.type) {
        case 'BACKEND_VERSION_FETCHED':
            return {...state, ...action.version};
        default:
            return state;
    }
}


const indiLiteApp = combineReducers({version, sequenceJobs, sequences, network, indiserver, notifications, errors, gear, indiservice, camera, settings, image, navigation, commands});

export default indiLiteApp
