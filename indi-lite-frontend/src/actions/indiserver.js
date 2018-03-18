import { getINDIServerStatusAPI, setINDIServerConnectionAPI, getINDIDevicesAPI, getINDIDevicePropertiesAPI, setINDIPropertiesAPI } from '../middleware/api'
import Notifications from './notifications'

export const INDIServer = {

    serverConnectionNotify: (state, dispatch) => {
        dispatch(INDIServer.receivedServerState(state.payload, dispatch));
        if(state.is_error) {
            return Notifications.add('INDI Server connection', 'Error while connecting to INDI server', 'error');
        }
        return Notifications.add('INDI Server connection', 'INDI server connected successfully', 'success', 10000);
    },

    serverDisconnectNotify: (state, dispatch) => {
        dispatch(INDIServer.receivedServerState(state.payload, dispatch));
        if(state.is_error) {
            return Notifications.add('INDI Server connection', 'Error while disconnecting to INDI server.', 'error');
        }
        return Notifications.add('INDI Server connection', 'INDI server disconnected successfully.', 'success', 10000);
    },


    serverDisconnectErrorNotify: (state, dispatch) => {
        dispatch(INDIServer.receivedServerState(state.payload, dispatch));
        return Notifications.add('Error', 'INDI server disconnected. Please check your server logs.', 'error');
    },


    receivedServerState: (state, dispatch) => {
        if(state.connected)
            dispatch(INDIServer.fetchDevices());
        return {
            type: 'RECEIVED_SERVER_STATE',
            state
        } 
    },

    receivedDevices: (devices, dispatch) => {
        devices.forEach(device => dispatch(INDIServer.fetchDeviceProperties(device.name)));
        return {
            type: 'RECEIVED_INDI_DEVICES',
            devices
        }
    },

    receivedDeviceProperties(device, data) {
        let groups = []
        let properties = {}

        data.forEach(property => {
            groups.push(property.group)
            properties = [...properties, property]
        });
        groups = groups.filter( (value, index, self) => self.indexOf(value) === index).map(group => { return {device, name: group} });
        return {
            type: 'RECEIVED_DEVICE_PROPERTIES',
            device,
            groups,
            properties
        }
    },

    fetchDeviceProperties: device => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_DEVICE_PROPERTIES'});
            return getINDIDevicePropertiesAPI(device, data => {
                dispatch(INDIServer.receivedDeviceProperties(device, data));
            }, error => console.log(error));
        }
    },

    fetchDevices: () => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_DEVICES'});
            return getINDIDevicesAPI(data => dispatch(INDIServer.receivedDevices(data, dispatch)), error => console.log(error));
        }
    },

    fetchServerState: () => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_SERVER_STATE'});
            return getINDIServerStatusAPI(data => dispatch(INDIServer.receivedServerState(data, dispatch)), error => console.log(error));
        }
    },

    setServerConnection: connect => {
        return dispatch => {
            dispatch({type: connect ? 'CONNECT_INDI_SERVER' : 'DISCONNECT_INDI_SERVER'});
            return setINDIServerConnectionAPI(connect, data => dispatch(INDIServer.receivedServerState(data, dispatch)), error => console.log(error));
        }
    },

    addPendingProperties: (pendingProperties, autoApply) => {
        return dispatch => {
            dispatch({ type: 'ADD_PENDING_PROPERTIES', pendingProperties, autoApply })
            if(autoApply) {
                dispatch({ type: 'COMMIT_PENDING_PROPERTIES', pendingProperties});
                setINDIPropertiesAPI(pendingProperties)
            }
        }
    },
}

export default INDIServer

