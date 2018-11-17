export const PlateSolving = {
    Options: {
        camera: 'CAMERA',
        telescope: 'TELESCOPE',
        astrometryDriver: 'ASTROMETRY_DRIVER',
    },
    setOption: (option, value) => ({ type: 'PLATESOLVING_SET_OPTION', option, value }),
    solveField: options => dispatch => {
        console.log(options);
        dispatch({ type: 'FETCH_PLATESOLVING_SOLVE_FIELD' });
    },
};