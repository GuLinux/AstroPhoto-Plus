const nativeFetch = (...args) => fetch(...args);
const EventSource = require('react-native-eventsource');

export {
    nativeFetch as fetch,
    EventSource,
};
