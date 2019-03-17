import isomorphicFetch from 'isomorphic-fetch';
import { EventSourcePolyfill } from 'event-source-polyfill';

const EventSourceProvider = EventSource || EventSourcePolyfill;
export {
    isomorphicFetch as fetch,
    EventSourceProvider as EventSource,
};
