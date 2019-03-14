import { API } from "../middleware/api";

const defaultState = {
    address: null,
};

export const backendSelection = (state = defaultState, action) => {
    switch(action.type) {
        case 'BACKEND_SET_ADDRESS':
            API.setBackendURL(action.address);
            return {...state, address: action.address};
        default:
            return state;
    }
}