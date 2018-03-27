import { getINDIServerStatusAPI, setINDIServerConnectionAPI, getINDIDevicesAPI, getINDIDevicePropertiesAPI, setINDIValuesAPI } from '../middleware/api'
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


    receivedServerState: (state, dispatch, fetchFullTree = false) => {
        if(fetchFullTree && state.connected)
            dispatch(INDIServer.fetchDevices());
        return {
            type: 'RECEIVED_SERVER_STATE',
            state
        } 
    },

    receivedDevices: (devices, dispatch) => {
        devices.forEach(device => dispatch(INDIServer.fetchDeviceProperties(device)));
        return {
            type: 'RECEIVED_INDI_DEVICES',
            devices
        }
    },

    receivedDeviceProperties: (device, data) => ({
            type: 'RECEIVED_DEVICE_PROPERTIES',
            device,
            properties: data
    }),

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

    fetchServerState: (fetchFullTree = false) => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_SERVER_STATE'});
            return getINDIServerStatusAPI(data => dispatch(INDIServer.receivedServerState(data, dispatch, fetchFullTree)), error => console.log(error));
        }
    },

    setServerConnection: connect => {
        return dispatch => {
            dispatch({type: connect ? 'CONNECT_INDI_SERVER' : 'DISCONNECT_INDI_SERVER'});
            return setINDIServerConnectionAPI(connect, data => dispatch(INDIServer.receivedServerState(data, dispatch)), error => console.log(error));
        }
    },

    addPendingValues: (device, property, pendingValues, autoApply) => {
        return dispatch => {
            dispatch({ type: 'ADD_PENDING_VALUES', device, property, pendingValues, autoApply })
            if(autoApply) {
                dispatch(INDIServer.commitPendingValues(device, property, pendingValues));
            }
        }
    },

    commitPendingValues: (device, property, pendingValues) => {
        setINDIValuesAPI(device, property, pendingValues, json => console.log(json), error => console.log(error));
        return { type: 'COMMIT_PENDING_VALUES', property, pendingValues }
    },

    deviceMessage: (device, message) => ({ type: 'INDI_DEVICE_MESSAGE', device, message }),
    propertyUpdated: property => ({ type: 'INDI_PROPERTY_UPDATED', property }),
    propertyAdded: property => ({ type: 'INDI_PROPERTY_ADDED', property }),
    propertyRemoved: property => ({ type: 'INDI_PROPERTY_REMOVED', property }),
    deviceAdded: device => ({ type: 'INDI_DEVICE_ADDED', device }),
    deviceRemoved: device => ({ type: 'INDI_DEVICE_REMOVED', device }),
}

export default INDIServer

