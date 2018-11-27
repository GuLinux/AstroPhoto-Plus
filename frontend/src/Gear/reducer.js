import { list2object } from '../utils';

const defaultState = {
    cameras: [],
    cameraEntities: {},
    filterWheels: [],
    filterWheelEntities: {},
    telescopes: [],
    telescopeEntities: {},
    astrometry: [],
    astrometryEntities: {},
}

const deviceRemoved = (state, device) => {
    let newState = {...state, cameras: state.cameras.filter(c => c.id !== device.id)};
    if(device.id in state.cameraEntities)
        delete newState.cameraEntities[device.id];
    return newState
}

const receivedGear = (state, {payload}, idsField, entitiesField) => ({
    ...state,
    [idsField]: payload.map(c => c.id),
    [entitiesField]: list2object(payload, 'id'),
});


const gear = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_CAMERAS':
            return receivedGear(state, action, 'cameras', 'cameraEntities');
        case 'RECEIVED_FILTER_WHEELS':
            return receivedGear(state, action, 'filterWheels', 'filterWheelEntities');
        case 'RECEIVED_TELESCOPES':
            return receivedGear(state, action, 'telescopes', 'telescopeEntities');
        case 'RECEIVED_ASTROMETRY_DRIVERS':
            return receivedGear(state, action, 'astrometry', 'astrometryEntities');
        case 'INDI_DEVICE_REMOVED':
            return deviceRemoved(action.device);
        case 'RECEIVED_SERVER_STATE':
            return action.state.connected ? state : {...defaultState}
        default:
            return state;
    }
}

export default gear;
