
const defaultState = {
    isError: false,
    lastErrorSource: '',
    lastErrorPayloadType: '',
    lastErrorPayload: {},
}

const errors = (state = defaultState, action) => {
    switch(action.type) {
        case 'SERVER_ERROR':
            return {...state, isError: true, lastErrorSource: action.source, lastErrorPayloadType: action.payloadType, lastErrorPayload: action.payload, lastResponseBody: action.responseBody };
        case 'BACKEND_VERSION_FETCHED':
            return defaultState;
        default:
            return state;
    }
}

export default errors;

