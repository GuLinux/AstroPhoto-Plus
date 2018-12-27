import 'eventsource'
import { normalize } from 'normalizr'
import { sequenceSchema } from './schemas'
import Actions from '../actions';
declare var EventSourcePolyfill: any;



const logEvent = event => {
    console.log('Unrecognized event received');
    console.log(event);
}

const indiserverEvents = (event, dispatch) => {
    let eventObject = JSON.parse(event.data);
    switch(eventObject.event) {
        case 'indi_server_connect':
            dispatch(Actions.INDIServer.serverConnectionNotify(eventObject, dispatch));
            break;
        case 'indi_server_disconnect':
            dispatch(Actions.INDIServer.serverDisconnectNotify(eventObject, dispatch));
            break;
        case 'indi_server_disconnect_error':
            dispatch(Actions.INDIServer.serverDisconnectErrorNotify(eventObject, dispatch));
            break;
        case 'indi_message':
            dispatch(Actions.INDIServer.deviceMessage(eventObject.payload.device, eventObject.payload.message));
            break;
        case 'indi_property_updated':
            dispatch(Actions.INDIServer.propertyUpdated(eventObject.payload));
            break;
        case 'indi_property_added':
            dispatch(Actions.INDIServer.propertyAdded(eventObject.payload));
            break
        case 'indi_property_removed':
            dispatch(Actions.INDIServer.propertyRemoved(eventObject.payload));
            break
        case 'indi_device_added':
            dispatch(Actions.INDIServer.deviceAdded(eventObject.payload));
            break;
        case 'indi_device_removed':
            dispatch(Actions.INDIServer.deviceRemoved(eventObject.payload));
            break;
        default:
            logEvent(event);
    }
}

const sequences = (event, dispatch) => {
    let eventObject = JSON.parse(event.data);
    switch(eventObject.event) {
        case 'sequence_updated':
            dispatch(Actions.Sequences.updated(normalize(eventObject.payload, sequenceSchema)));
            break;
        case 'sequence_error':
            dispatch(Actions.Sequences.error(eventObject.payload));
            break
        default:
            logEvent(event)
    }
}

const indiserviceEvents = (event, dispatch) => {
    let eventObject = JSON.parse(event.data);
    switch(eventObject.event) {
        case 'started':
            dispatch(Actions.INDIService.serviceStarted(eventObject));
            break;
        case 'exited':
            dispatch(Actions.INDIService.serviceExited(eventObject));
            break;
        default:
            logEvent(event)
    }
}

const listenToEvents = (dispatch) => {
    var es = new EventSource("/api/events");

    var serverListener = event => {
        switch(event.type) {
            case 'indi_server':
                indiserverEvents(event, dispatch);
                break;
            case 'sequences':
                sequences(event, dispatch);
                break;
            case 'indi_service':
                indiserviceEvents(event, dispatch);
                break
            default:
                logEvent(event);
        }
    }
    es.addEventListener('indi_server', serverListener);
    es.addEventListener('sequences', serverListener);
    es.addEventListener('indi_service', serverListener);
    es.onerror = e => dispatch(Actions.serverError('event_source', 'event', e));
}

export default listenToEvents;
