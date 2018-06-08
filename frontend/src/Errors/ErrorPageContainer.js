import { connect } from 'react-redux'
import ErrorPage from './ErrorPage'
import React from 'react'


const mapStateToProps = (state, ownProps) => {
    let payload = state.errors.lastErrorPayload;
    let payloadAsString = String(payload);
    switch(state.errors.lastErrorPayloadType) {
        case 'exception':
            payloadAsString = `exception: ${payload.name} ${payload.message}\n${payload.stack}`
            break;
        case 'event':
            payloadAsString = String(payload.target);
            break;
        case 'response':
            payloadAsString = `status: ${payload.status} - ${payload.statusText}\nURL: ${payload.url}\nBody:\n${state.errors.lastResponseBody}`;
            break;
        default:
            break;
    };
    return {
        errorSource: state.errors.lastErrorSource,
        errorPayload: payloadAsString,
        isError: state.errors.isError,
    }
}


const ErrorPageContainer = ({isError, errorSource, errorPayload, children}) => {
    if(isError) {
        return <ErrorPage errorSource={errorSource} errorPayload={errorPayload} />
    }
    return children;
}



export default connect(mapStateToProps)(ErrorPageContainer)

