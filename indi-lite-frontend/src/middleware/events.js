import 'eventsource'
declare var EventSourcePolyfill: any;


const listenToEvents = (dispatch) => {
    var es = new EventSource("/api/events");
    var indiServerListener = event => {
        console.log(event);
    }
    es.addEventListener('indi_server', indiServerListener);
}

export default listenToEvents; 
