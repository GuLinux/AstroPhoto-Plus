import { fetchPHD2Status } from '../middleware/api';


export const updatePHD2Status = status => ({ type: 'UPDATE_PHD2_STATUS', status });

export const getPHD2Status = () => dispatch => {
    dispatch({ type: 'FETCHING_PHD2_STATUS' });
    fetchPHD2Status(dispatch, status => dispatch(updatePHD2Status(status)));
};


export const phd2Disconnected = (errorMessage) => ({ type: 'PHD2_DISCONNECTED', errorMessage });
