import Actions from '../actions';
import {AsyncStorage} from 'react-native';
import { API } from '../middleware/api';
import { init } from '../App/actions';

export const BackendSelection = {
    setBackend: address => {
        API.setBackendURL(address);
        return { type: 'BACKEND_SET_ADDRESS', address}
    },

    saveBackend: address => dispatch => {
        dispatch(Actions.BackendSelection.setBackend(address));
        dispatch(init());
        AsyncStorage.setItem('backend_address', address);
    },

    loadAddress: () => dispatch => {
        Actions.BackendSelection.getAddress(dispatch);
    },

    getAddress: async dispatch => {
        const address = await AsyncStorage.getItem('backend_address');
        if(address !== null) {
            dispatch(Actions.BackendSelection.setBackend(address));
        }
        return address;
    },
}