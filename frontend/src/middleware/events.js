import { normalize } from 'normalizr'
import { sequenceSchema } from './schemas'
import Actions from '../actions';
import { EventSource } from './polyfills';
import { API } from './api';
import { serverError } from '../App/actions';
import { phd2Started, phd2Exited } from '../Autoguiding/actions';


const logEvent = event => {
    console.log('Unrecognized event received');
    console.log(event);
}

const indiserverEvents = dispatch => event => {
    let eventObject = JSON.parse(event.data);
    switch(eventObject.event) {
        case 'indi_server_connect':
            dispatch(Actions.INDIServer.serverConnectionNotify(eventObject.payload, eventObject.is_error));
            break;
        case 'indi_server_disconnect':
            dispatch(Actions.INDIServer.serverDisconnectNotify(eventObject.payload, eventObject.is_error));
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

const sequences = dispatch => event => {
    let eventObject = JSON.parse(event.data);
    switch(eventObject.event) {
        case 'sequence_updated':
            dispatch(Actions.Sequences.updated(normalize(eventObject.payload, sequenceSchema)));
            break;
        case 'sequence_error':
            dispatch(Actions.Sequences.error(eventObject.payload));
            break
        case 'sequence_paused':
            dispatch(Actions.Notifications.add('Sequence Paused', eventObject.payload.notification_message, 'success', eventObject.payload.notification_timeout * 1000))
            break;
        default:
            logEvent(event)
    }
}

const indiserviceEvents = dispatch => event => {
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

const astrometryIndexDownloader = dispatch => event => {
    let eventObject = JSON.parse(event.data);
    switch(eventObject.event) {
        case 'progress':
            dispatch(Actions.Settings.downloadIndexesProgress(eventObject.payload));
            break;
        case 'error':
            dispatch(Actions.Settings.downloadIndexesError(eventObject.payload));
            break;
        case 'finished':
            dispatch(Actions.Settings.downloadIndexesFinished());
            break;
        default:
            // ignoring other events
            // logEvent(event);
            break;
    }
}

const phdEventsListener = dispatch => event => {
    let eventObject = JSON.parse(event.data);
    switch(eventObject.event) {
        case 'phd2_started':
            dispatch(phd2Started());
            break;
        case 'phd2_exited':
            dispatch(phd2Exited(eventObject.payload));
            break;
        default:
            logEvent(eventObject);
    }
};

var eventSourceInstance;


const listenToEvents = (dispatch) => {
    eventSourceInstance = new EventSource(API.getFullURL('/api/events'));
    eventSourceInstance.addEventListener('indi_server', indiserverEvents(dispatch));
    eventSourceInstance.addEventListener('sequences', sequences(dispatch));
    eventSourceInstance.addEventListener('indi_service', indiserviceEvents(dispatch));
    eventSourceInstance.addEventListener('astrometry_index_downloader', astrometryIndexDownloader(dispatch));
    eventSourceInstance.addEventListener('phd2', phdEventsListener(dispatch));
    eventSourceInstance.onerror = e => {
        dispatch(serverError('event_source', 'event', e));
        eventSourceInstance.close();
    }
}

export default listenToEvents;
