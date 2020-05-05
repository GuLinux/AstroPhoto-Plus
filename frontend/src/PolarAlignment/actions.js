import { shoot } from '../Camera/actions';
import { addNotification } from '../Notifications/actions';
import { getSelectedGuider } from './selectors';
import { startDARVGuiding } from '../middleware/api';


export const startDARV = (shotParameters) => (dispatch, getState) => {
    const { exposure } = shotParameters;
    if(exposure < 30) {
        return dispatch(addNotification('DARV Polar Alignment', 'Exposure should be at least 30 seconds', 'warning', 10000));
    }
    const guider = getSelectedGuider(getState());
    if(guider !== 'Manual') {
        startDARVGuiding(dispatch, guider, { exposure }, () => {});
    }
    return dispatch(shoot(shotParameters));
};

export const setDARVGuider = guider => ({ type: 'POLAR_ALIGNMENT_SET_DARV_GUIDER', guider });
