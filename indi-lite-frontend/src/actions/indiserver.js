import { getINDIServerStatusAPI, setINDIServerConnectionAPI } from '../middleware/api'

export const INDIServer = {

    receivedServerState: (state) => {
        return {
            type: 'RECEIVED_SERVER_STATE',
            state
        } 
    },

    fetchServerState: () => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_SERVER_STATE'});
            return getINDIServerStatusAPI(data => {
                dispatch(INDIServer.receivedServerState(data));
            }, error => console.log(error));
        }
    },

    setServerConnection: connect => {
        return dispatch => {
            dispatch({type: connect ? 'CONNECT_INDI_SERVER' : 'DISCONNECT_INDI_SERVER'});
            return setINDIServerConnectionAPI(connect, data => {
                dispatch(INDIServer.receivedServerState(data));
            }, error => console.log(error));
        }
    }

}

export default INDIServer

