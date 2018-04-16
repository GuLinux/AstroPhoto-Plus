import 'eventsource'
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
    console.log(event)
    console.log(eventObject)
    switch(eventObject.event) {
        case 'sequence_updated':
            dispatch(Actions.Sequences, eventObject.payload);
            break;
        default:
            logEvent(event)
    }
}

const listenToEvents = (dispatch) => {
    var es = new EventSource("/api/events");
    var indiServerListener = event => {
        switch(event.type) {
            case 'indi_server':
                indiserverEvents(event, dispatch);
                break;
            case 'sequences':
                sequences(event, dispatch);
                break;
            default:
                logEvent(event);
        }
    }
    es.addEventListener('indi_server', indiServerListener);
    es.onerror = e => dispatch(Actions.serverError('event_source', 'event', e));
}

export default listenToEvents; 
