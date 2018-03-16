import 'eventsource'
import INDIServer from '../actions/indiserver';
declare var EventSourcePolyfill: any;



const logEvent = event => {
    console.log('Unrecognized event received');
    console.log(event);
}

const indiserverEvents = (event, dispatch) => {
    let eventObject = JSON.parse(event.data);
    switch(eventObject.event) {
        case 'indi_server_connect':
            dispatch(INDIServer.serverConnectionNotify(eventObject, dispatch));
            break;
        case 'indi_server_disconnect':
            dispatch(INDIServer.serverDisconnectNotify(eventObject, dispatch));
            break;
        default:
            logEvent(event);
    }
}

const listenToEvents = (dispatch) => {
    var es = new EventSource("/api/events");
    var indiServerListener = event => {
        switch(event.type) {
            case 'indi_server':
                indiserverEvents(event, dispatch);
                break;
            default:
                logEvent(event);
        }
    }
    es.addEventListener('indi_server', indiServerListener);
}

export default listenToEvents; 
