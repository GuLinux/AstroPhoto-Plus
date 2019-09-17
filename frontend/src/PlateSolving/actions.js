import { solveFieldAPI, fetchPlatesolvingStatus, abortSolveFieldAPI } from "../middleware/api";
import Actions from '../actions';
import { solveFromCameraSelector, getPlateSolvingMainTarget, getPlateSolvingTargets } from './selectors';


export const PlateSolving = {
    Options: {
        camera: 'camera',
        telescope: 'telescope',
        fov: 'fov',
        fovSource: 'fovSource',
        syncTelescope: 'syncTelescope',
        downsample: 'downsample',
        searchRadius: 'searchRadius',
    },
    setOption: (option, value) => ({ type: 'PLATESOLVING_SET_OPTION', option, value }),
    resetMessages: () => ({ type: 'PLATESOLVING_RESET_MESSAGES' }),
    message: message => ({ type: 'PLATESOLVING_MESSAGE', message }),

    fieldSolved: payload => ({ type: 'PLATESOLVING_SOLVED', payload }),
    solvingFailed: payload => ({ type: 'PLATESOLVING_FAILED', payload }),

    getStatus: () => dispatch => {
        dispatch({ type: 'FETCH_PLATESOLVING_STATUS'});
        fetchPlatesolvingStatus(
            dispatch,
            response => dispatch({ type: 'RESPONSE_PLATESOLVING_STATUS', response}),
            error => dispatch({ type: 'ERROR_FETCHING_PLATESOLVING_STATUS', error}),
        );
    },

    abortSolveField: () => dispatch => {
        dispatch({ type: 'SOLVE_FIELD_ABORTING' });
        const onSuccess = response => {
            dispatch({ type: 'RESPONSE_PLATESOLVING_STATUS', response });
        };
        abortSolveFieldAPI(dispatch, onSuccess);
    },

    solveField: options => (dispatch, getState) => {
        dispatch({ type: 'FETCH_PLATESOLVING_SOLVE_FIELD' });
        dispatch(Actions.PlateSolving.resetMessages());
        const onSuccess = response => {
            dispatch({ type: 'RESPONSE_PLATESOLVING_STATUS', response });
        };
        const onError = (error, isJSON) => {
            if(!isJSON) {
                if(error.status === 413) {
                    const error_message = 'Request body too large. You probably need to configure your web server (nginx, apache) to accept large files upload.'
                    dispatch(Actions.Notifications.add('Platesolving failed', error_message, 'warning', 5000));
                    dispatch(Actions.PlateSolving.solvingFailed(error_message));
                    return true;
                } else {
                    return false;
                }
            }
            error.json().then( ({error_message}) => {
                dispatch(Actions.Notifications.add('Platesolving failed', error_message, 'warning', 5000));
                dispatch(Actions.PlateSolving.solvingFailed(error_message));
            });
            return true;
        }
        const state = getState();
        const target = getPlateSolvingMainTarget(state);
        if(target) {
            options = {...options, target: getPlateSolvingTargets(state).find(t => t.id === target)};
        }
        solveFieldAPI(dispatch, onSuccess, onError, options);
    },

    solveCameraImage: filePath => (dispatch, getState) => {
        const { options } = solveFromCameraSelector(getState());
        if(!options.camera || ! options.telescope)
            return;
        dispatch({ type: 'PLATESOLVING_SOLVING_CAMERAFILE'});
        dispatch(Actions.PlateSolving.solveField({ filePath, ...options }));
    },

    addTargetObject: object => (dispatch, getState) => {
        const targetsEmpty = getPlateSolvingTargets(getState()).length === 0
        dispatch({ type: 'PLATESOLVING_ADD_TARGET', object });
        if(targetsEmpty) {
            dispatch(Actions.PlateSolving.setMainTarget(object.id));
        }
    },

    setMainTarget: object => ({ type: 'PLATESOLVING_SET_MAIN_TARGET', object }),
    removeTarget: object => ({ type: 'PLATESOLVING_REMOVE_TARGET', object }),
};
