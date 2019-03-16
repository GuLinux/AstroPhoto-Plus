import { fetchPHD2ServerStatusAPI, startPHD2API, stopPHD2API, resetPHD2API  } from "../middleware/api";
import { addNotification } from "../Notifications/actions";


export const getAutoguidingStatus = () => dispatch => {
    dispatch({ type: 'FETCH_PHD2_SERVER_STATUS' });
    return fetchPHD2ServerStatusAPI(dispatch, status => dispatch(receivedPHD2ServerStatus(status)));
}

const receivedPHD2ServerStatus = status => ({ type: 'RECEIVED_PHD2_SERVER_STATUS', status });

export const startPHD2Server = options => dispatch => {
    dispatch({ type: 'FETCH_START_PHD2' });
    return startPHD2API(dispatch, options, data => dispatch({ type: 'PHD2_STARTING', ...data }));
}

export const stopPHD2Server = () => dispatch => {
    dispatch({ type: 'FETCH_STOP_PHD2' });
    return stopPHD2API(dispatch, data => dispatch({ type: 'PHD2_STOPPING', ...data }));
}

export const resetPHD2Server = () => dispatch => {
    dispatch({ type: 'FETCH_RESET_PHD2' });
    return resetPHD2API(dispatch, data => dispatch({ type: 'PHD2_RESET', ...data }));
}

export const phd2Started = () => dispatch => {
    dispatch(receivedPHD2ServerStatus({ is_running: true }));
    dispatch(addNotification('PHD2 Started', 'PHD2 server successfully started', 'success', 5000));
}

export const phd2Exited = ({exit_code, stdout, stderr}) => dispatch => {
    dispatch(receivedPHD2ServerStatus({ is_running: false }));
    if(exit_code === 0) {
        dispatch(addNotification('PHD2 Stopped', 'PHD2 stopped successfully started', 'success', 5000));
    } else {
        if(stderr.includes('already running')) {
            dispatch({ type: 'PHD2_SERVER_ALREADY_RUNNING' });
        } else {
            dispatch(addNotification('PHD2 Exited', `PHD2 Server returned ${exit_code}`, 'warning'));
        }
    }
}