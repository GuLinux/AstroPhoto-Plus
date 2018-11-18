import { solveFieldAPI } from "../middleware/api";

export const PlateSolving = {
    Options: {
        camera: 'camera',
        telescope: 'telescope',
        astrometryDriver: 'astrometryDriver',
    },
    setOption: (option, value) => ({ type: 'PLATESOLVING_SET_OPTION', option, value }),
    solveField: ({astrometryDriver, ...options}) => dispatch => {
        console.log(astrometryDriver, options);
        dispatch({ type: 'FETCH_PLATESOLVING_SOLVE_FIELD' });
        return solveFieldAPI(dispatch, (r) => console.log(r), astrometryDriver, options);
    },
};