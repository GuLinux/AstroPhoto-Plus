import Actions from '../actions';
import {AsyncStorage} from 'react-native';

export const BackendSelection = {
    setBackend: address => ({ type: 'BACKEND_SET_ADDRESS', address}),

    saveBackend: address => dispatch => {
        dispatch(Actions.BackendSelection.setBackend(address));
        dispatch(Actions.init());
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