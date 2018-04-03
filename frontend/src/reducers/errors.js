
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
        default:
            return state;
    }
}

export default errors;

