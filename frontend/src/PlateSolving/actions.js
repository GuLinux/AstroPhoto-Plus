import { solveFieldAPI } from "../middleware/api";
import Actions from '../actions';

export const PlateSolving = {
    Options: {
        camera: 'camera',
        telescope: 'telescope',
        astrometryDriver: 'astrometryDriver',
        fov: 'fov',
    },
    setOption: (option, value) => ({ type: 'PLATESOLVING_SET_OPTION', option, value }),
    solveField: ({astrometryDriver, ...options}) => dispatch => {
        console.log(astrometryDriver, options);
        dispatch({ type: 'FETCH_PLATESOLVING_SOLVE_FIELD' });
        return solveFieldAPI(dispatch, result => {
            dispatch(Actions.Notifications.add('Platesolving successful', '', 'success', 5000));
        }, async (error, isJSON) => {
            if(!isJSON) {
                return false;
            }
            const { error_message } = await error.json();
            dispatch(Actions.Notifications.add('Platesolving failed', error_message, 'warning', 5000));
            return true;
        }, astrometryDriver, options);
    },
};
