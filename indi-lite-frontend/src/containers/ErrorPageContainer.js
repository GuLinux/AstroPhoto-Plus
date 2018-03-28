import { connect } from 'react-redux'
import ErrorPage from '../components/ErrorPage'


const mapStateToProps = (state, ownProps) => {
    let payload = state.errors.lastErrorPayload;
    let payloadAsString = String(payload);
    switch(state.errors.lastErrorPayloadType) {
        case 'exception':
            payloadAsString = `exception: ${payload.name} ${payload.message}\n${payload.stack}`
            break;
        case 'event':
            payloadAsString = String(payload.target);
        case 'response':
            payloadAsString = `status: ${payload.status} - ${payload.statusText}\nURL: ${payload.url}\nBody:\n${state.errors.lastResponseBody}`;
        default:
            break;
    };
    return {
        errorSource: state.errors.lastErrorSource,
        errorPayload: payloadAsString,
    }
}


const ErrorPageContainer = connect(mapStateToProps)(ErrorPage)

export default ErrorPageContainer

