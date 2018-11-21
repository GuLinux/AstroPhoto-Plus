import { solveFieldAPI } from "../middleware/api";
import Actions from '../actions';

export const PlateSolving = {
    Options: {
        camera: 'camera',
        telescope: 'telescope',
        astrometryDriver: 'astrometryDriver',
        fov: 'fov',
        fovSource: 'fovSource',
        syncTelescope: 'syncTelescope',
    },
    setOption: (option, value) => ({ type: 'PLATESOLVING_SET_OPTION', option, value }),

    fieldSolved: payload => ({ type: 'PLATESOLVING_SOLVED', payload }),
    solvingFailed: payload => ({ type: 'PLATESOLVING_FAILED', payload }),

    solveField: ({astrometryDriver, ...options}) => dispatch => {
        dispatch({ type: 'FETCH_PLATESOLVING_SOLVE_FIELD' });
        return solveFieldAPI(dispatch, result => {
            dispatch(Actions.Notifications.add('Platesolving successful', '', 'success', 5000));
            dispatch(Actions.PlateSolving.fieldSolved(result));
        }, async (error, isJSON) => {
            if(!isJSON) {
                return false;
            }
            const { error_message } = await error.json();
            dispatch(Actions.Notifications.add('Platesolving failed', error_message, 'warning', 5000));
            dispatch(Actions.PlateSolving.solvingFailed(error_message));
            return true;
        }, astrometryDriver, options);
    },
};
