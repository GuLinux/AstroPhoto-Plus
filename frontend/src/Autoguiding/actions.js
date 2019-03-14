import { fetchAutoguidingStateAPI } from "../middleware/api";

export const getAutoguidingStatus = () => dispatch => {
    dispatch({ type: 'FETCH_AUTOGUIDING_STATUS' });
    return fetchAutoguidingStateAPI(dispatch, status => dispatch({ type: 'RECEIVED_AUTOGUIDING_STATUS', status }));
}