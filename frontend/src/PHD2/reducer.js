import { get } from 'lodash';

const defaultState = {
    connected: false,
    guideSteps: [],
};


const guidingStep = (state, action) => {
    if(state.starLost && Date.now() - state.lastStarLost < 5000) {
        return state;
    }
    const guideSteps = [...state.guideSteps.filter(s => s.Timestamp > action.guideStep.Timestamp - get(state, 'graphMaxSeconds', 10)), action.guideStep];
    return {...state, starLost: false, guideSteps};
}

export const phd2 = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PHD2_STATUS':
            return {...state, ...get(action, 'status', {}), connectionError: get(action, 'status.connectionError')};
        case 'PHD2_DISCONNECTED':
            return {...defaultState, ...action.payload};
        case 'PHD2_STAR_LOST':
            return {...state, starLost: true, lastStarLost: Date.now()};
        case 'PHD2_GUIDE_STEP':
            return guidingStep(state, action);
        default:
            return state;
    }

}
