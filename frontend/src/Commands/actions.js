import { fetchCommandsAPI } from '../middleware/api'

export const Commands = {
    get: () => dispatch => {
        dispatch({ type: 'GET_COMMANDS' });
        return fetchCommandsAPI(dispatch, data => {
            dispatch(Commands.gotCommands(data.entities.commands, data.result));
        });
    },

    gotCommands: (commands, ids) => ({ type: 'GOT_COMMANDS', commands, ids }),
}

export default Commands;
