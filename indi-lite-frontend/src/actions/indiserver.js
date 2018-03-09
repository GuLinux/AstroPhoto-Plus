import { getINDIServerStatusAPI, setINDIServerConnectionAPI, getINDIDevicesAPI, getINDIDevicePropertiesAPI } from '../middleware/api'

export const INDIServer = {

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
        let groups = {}
        let properties = {}

        data.forEach(property => {
            let currentGroups = device in groups ? groups[device] : []
            groups[device] = new Set([...currentGroups, property.group])
            let key = `${device}-${property.group}-${property.name}`
            properties = { ...properties, [key]: property }
        });
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
}

export default INDIServer

