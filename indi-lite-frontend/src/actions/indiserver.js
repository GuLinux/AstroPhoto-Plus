import { getINDIServerStatusAPI, setINDIServerConnectionAPI, getINDIDevicesAPI } from '../middleware/api'

export const INDIServer = {

    receivedServerState: (state) => {
        return {
            type: 'RECEIVED_SERVER_STATE',
            state
        } 
    },

    receivedDevices: (data) => {
        return {
            type: 'RECEIVED_INDI_DEVICES',
            devices: data
        }
    },

    fetchDevices: () => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_DEVICES'});
            return getINDIDevicesAPI(data => {
                dispatch(INDIServer.receivedDevices(data));
            }, error => console.log(error));
        }
    },

    fetchServerState: () => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_SERVER_STATE'});
            return getINDIServerStatusAPI(data => {
                dispatch(INDIServer.receivedServerState(data));
                if(data.connected)
                    dispatch(INDIServer.fetchDevices());
            }, error => console.log(error));
        }
    },

    setServerConnection: connect => {
        return dispatch => {
            dispatch({type: connect ? 'CONNECT_INDI_SERVER' : 'DISCONNECT_INDI_SERVER'});
            return setINDIServerConnectionAPI(connect, data => {
                dispatch(INDIServer.receivedServerState(data));
                if(data.connected)
                    dispatch(INDIServer.fetchDevices());

            }, error => console.log(error));
        }
    },

}

export default INDIServer

