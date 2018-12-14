import isomorphicFetch from 'isomorphic-fetch';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
const EventSource = NativeEventSource || EventSourcePolyfill;



export {
    isomorphicFetch as fetch,
    EventSource,
};
