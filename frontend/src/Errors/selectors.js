import { createSelector } from 'reselect';

export const isError = state => state.errors.isError

export const errorPageSelector = createSelector(
    [
        state => state.errors.lastErrorPayload,
        state => state.errors.lastErrorPayloadType,
        state => state.errors.lastResponseBody,
        state => state.errors.lastErrorSource,
        isError,
    ],
    (payload, lastErrorPayloadType, lastResponseBody, errorSource, isError) => {
        let payloadAsString = String(payload);
        switch(lastErrorPayloadType) {
            case 'exception':
                payloadAsString = `exception: ${payload.name} ${payload.message}\n${payload.stack}`
                break;
            case 'event':
                payloadAsString = String(payload.target);
                break;
            case 'response':
                payloadAsString = `status: ${payload.status} - ${payload.statusText}\nURL: ${payload.url}\nBody:\n${lastResponseBody}`;
                break;
            default:
                break;
        };
        return {
            errorSource,
            errorPayload: payloadAsString,
            isError,
        }
    }
);
