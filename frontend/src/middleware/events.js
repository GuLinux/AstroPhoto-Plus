import { normalize } from 'normalizr'
import { sequenceSchema } from './schemas'
import Actions from '../actions';
import { EventSource } from './polyfills';
import { API } from './api';
import { serverError } from '../App/actions';
import { phd2Disconnected, phd2Connected, updatePHD2Status, phd2GuidingStarted, phd2GuidingStopped, phd2StarLost, phd2GuideStep } from '../PHD2/actions';
import { receivedNetworkManagerStatus } from '../Settings/actions';
import { receivedPlatesolvingStatus } from '../PlateSolving/actions';


const logEvent = event => {
    console.log('Unrecognized event received');
    console.log(event);
}

const indiserverEvents = (event, dispatch) => {
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

const sequences = (event, dispatch) => {
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

const astrometryIndexDownloader = (event, dispatch) => {
    const eventObject = JSON.parse(event.data);
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

const plateslvingEvents = (event, dispatch) => {
    const eventObject = JSON.parse(event.data);
    switch(eventObject.event) {
        case 'platesolving_message':
            dispatch(Actions.PlateSolving.message(eventObject.payload.message));
            break;
        case 'platesolving_status':
            dispatch(receivedPlatesolvingStatus(eventObject.payload));
            break;

        case 'platesolving_finished':
            if(eventObject.is_error) {
                dispatch(Actions.Notifications.add('Platesolving failed', eventObject.payload.error, 'warning', 5000));
                dispatch(Actions.PlateSolving.solvingFailed(eventObject.payload.error));
            }

            if(eventObject.payload.status === 'solved') {
                dispatch(Actions.Notifications.add('Platesolving successful', '', 'success', 5000));
                dispatch(Actions.PlateSolving.fieldSolved({ solution: eventObject.payload.solution }));

            }
            break;
        default:
            logEvent(event);
    }
}

const phd2Events = (event, dispatch) => {
    const eventObject = JSON.parse(event.data);
    switch(eventObject.event) {
        case 'disconnected':
            dispatch(phd2Disconnected(eventObject.payload));
            break;
        case 'connected':
            dispatch(phd2Connected(eventObject.payload));
            break;
        case 'guiding_started':
            dispatch(phd2GuidingStarted(eventObject.payload));
            break;
        case 'guiding_stopped':
            dispatch(phd2GuidingStopped(eventObject.payload));
            break;
        case 'star_lost':
            dispatch(phd2StarLost(eventObject.payload));
            break;
        case 'guide_step':
            dispatch(phd2GuideStep(eventObject.payload.guide_step, eventObject.payload.state));
            break;
        case 'phd2_state':
        case 'profiles':
            dispatch(updatePHD2Status(eventObject.payload));
            break;
        default:
            logEvent(event);
    }
};

const networkEvents = (event, dispatch) => {
    const eventObject = JSON.parse(event.data);
    switch(eventObject.event) {
        case 'networks_changed':
            console.log(eventObject);
            console.log(receivedNetworkManagerStatus);
            console.log(dispatch);
            dispatch(receivedNetworkManagerStatus(eventObject.payload));
            break;
        default:
            logEvent(event);
    }
}


const listenToEvents = (dispatch) => {
    var es = new EventSource(API.getFullURL('/api/events'));

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
            case 'astrometry_index_downloader':
                astrometryIndexDownloader(event, dispatch);
                break;
            case 'platesolving':
                plateslvingEvents(event, dispatch);
                break;
            case 'phd2':
                phd2Events(event, dispatch);
                break;
            case 'network':
                networkEvents(event, dispatch);
                break;
            default:
                logEvent(event);
        }
    }
    es.addEventListener('indi_server', serverListener);
    es.addEventListener('sequences', serverListener);
    es.addEventListener('indi_service', serverListener);
    es.addEventListener('platesolving', serverListener);
    es.addEventListener('astrometry_index_downloader', serverListener);
    es.addEventListener('phd2', serverListener);
    es.addEventListener('network', serverListener);
    es.onerror = e => {
        dispatch(serverError('event_source', 'event', e));
        es.close();
        es = null;
    }
}

export default listenToEvents;
