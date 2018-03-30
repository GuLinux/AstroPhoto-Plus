const defaultState = {
    cameras: [],
    cameraEntities: {},
    filterWheels: [],
    filterWheelEntities: {},
}

const buildCameraEntities = cameras => cameras.reduce( (acc, camera) => ({...acc, [camera.id]: camera}), {});

const deviceRemoved = (state, device) => {
    let newState = {...state, cameras: state.cameras.filter(c => c.id !== device.id)};
    if(device.id in state.cameraEntities)
        delete newState.cameraEntities[device.id];
    return newState
}

const gear = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_CAMERAS':
            return {...state, cameras: action.cameras.map(c => c.id), cameraEntities: buildCameraEntities(action.cameras)};
        case 'INDI_DEVICE_REMOVED':
            return deviceRemoved(action.device);
        case 'RECEIVED_SERVER_STATE':
            return action.state.connected ? state : {...defaultState}
        default:
            return state;
    }
}

export default gear;
