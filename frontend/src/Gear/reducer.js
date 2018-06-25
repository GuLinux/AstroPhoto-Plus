import { list2object } from '../utils';

const defaultState = {
    cameras: [],
    cameraEntities: {},
    filterWheels: [],
    filterWheelEntities: {},
}

const deviceRemoved = (state, device) => {
    let newState = {...state, cameras: state.cameras.filter(c => c.id !== device.id)};
    if(device.id in state.cameraEntities)
        delete newState.cameraEntities[device.id];
    return newState
}

const gear = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_CAMERAS':
            return {...state, cameras: action.cameras.map(c => c.id), cameraEntities: list2object(action.cameras, 'id')};
        case 'RECEIVED_FILTER_WHEELS':
            return {...state, filterWheels: action.filterWheels.map(c => c.id), filterWheelEntities: list2object(action.filterWheels, 'id')};
        case 'INDI_DEVICE_REMOVED':
            return deviceRemoved(action.device);
        case 'RECEIVED_SERVER_STATE':
            return action.state.connected ? state : {...defaultState}
        default:
            return state;
    }
}

export default gear;
