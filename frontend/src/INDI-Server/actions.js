import { getINDIServerStatusAPI, setINDIServerConnectionAPI, getINDIDevicesAPI, getINDIDevicePropertiesAPI, setINDIValuesAPI, autoloadConfigurationAPI } from '../middleware/api';
import Actions from '../actions';
import { get } from 'lodash';

export const INDIServer = {
    serverConnectionNotify: (state, dispatch) => {
        dispatch(INDIServer.receivedServerState(state.payload, dispatch));
        if(state.is_error) {
            return Actions.Notifications.add('INDI Server connection', 'Error while connecting to INDI server', 'error');
        }
        return Actions.Notifications.add('INDI Server connection', 'INDI server connected successfully', 'success', 10000);
    },

    serverDisconnectNotify: (state, dispatch) => {
        dispatch(INDIServer.receivedServerState(state.payload, dispatch));
        if(state.is_error) {
            return Actions.Notifications.add('INDI Server connection', 'Error while disconnecting to INDI server.', 'error');
        }
        return Actions.Notifications.add('INDI Server connection', 'INDI server disconnected successfully.', 'success', 10000);
    },


    serverDisconnectErrorNotify: (state, dispatch) => {
        dispatch(INDIServer.receivedServerState(state.payload, dispatch));
        return Actions.Notifications.add('Error', 'INDI server disconnected. Please check your server logs.', 'error');
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
            return getINDIDevicePropertiesAPI(dispatch, device, data => {
                dispatch(INDIServer.receivedDeviceProperties(device, data));
            });
        }
    },

    fetchDevices: () => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_DEVICES'});
            return getINDIDevicesAPI(dispatch, data => dispatch(INDIServer.receivedDevices(data, dispatch)));
        }
    },

    fetchServerState: (fetchFullTree = false) => {
        return dispatch => {
            dispatch({type: 'FETCH_INDI_SERVER_STATE'});
            return getINDIServerStatusAPI(dispatch, data => dispatch(INDIServer.receivedServerState(data, dispatch, fetchFullTree)));
        }
    },

    setServerConnection: connect => {
        return dispatch => {
            dispatch({type: connect ? 'CONNECT_INDI_SERVER' : 'DISCONNECT_INDI_SERVER'});
            return setINDIServerConnectionAPI(dispatch, connect, data => dispatch(INDIServer.receivedServerState(data, dispatch)));
        }
    },

    autoloadConfig: (device) => dispatch => {
        return autoloadConfigurationAPI(dispatch, device.name, json => {
            if(json.result)
                dispatch({type: 'INDI_CONFIG_AUTOLOADED', device});
        });
    },

    setPropertyValues: (device, property, values) => {
        return dispatch => {
            setINDIValuesAPI(dispatch, device, property, values, json => {});
            dispatch({ type: 'INDI_REQUEST_SET_PROPERTY_VALUES', property, values})
        }
    },

    deviceMessage: (device, message) => ({ type: 'INDI_DEVICE_MESSAGE', device, message }),

    propertyUpdated: property => (dispatch, getState) => {
        if(property.name === 'CONNECTION') {
            if(property.values.find(v => v.name === 'CONNECT' && v.value)) {
                dispatch({type: 'INDI_DEVICE_CONNECTED', device: property.device})
                setTimeout(() => dispatch(Actions.INDIServer.autoloadConfig(get(getState(), ['indiserver', 'devices', 'entities', property.device]))), 1500);
            }
            else {
                dispatch({type: 'INDI_DEVICE_DISCONNECTED', device: property.device})
            }
            Actions.Gear.fetchAll(dispatch);
        }
        dispatch({ type: 'INDI_PROPERTY_UPDATED', property })
    },

    propertyAdded: property => ({ type: 'INDI_PROPERTY_ADDED', property }),

    propertyRemoved: property => ({ type: 'INDI_PROPERTY_REMOVED', property }),

    deviceAdded: device => {
        return dispatch => {
            dispatch({ type: 'INDI_DEVICE_ADDED', device })
        }
    },
    
    deviceRemoved: device => ({ type: 'INDI_DEVICE_REMOVED', device }),
}

export default INDIServer

