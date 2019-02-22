const nativeFetch = (...args) => fetch(...args);
import { NativeEventSource } from 'event-source-polyfill';

export {
    nativeFetch as fetch,
    NativeEventSource as EventSource,
};
