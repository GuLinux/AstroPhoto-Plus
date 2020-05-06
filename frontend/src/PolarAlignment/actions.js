import { shoot } from '../Camera/actions';
import { addNotification } from '../Notifications/actions';
import { getSelectedGuider } from './selectors';
import { startDARVGuiding } from '../middleware/api';


export const setDARVStatus = status => ({ type: 'POLAR_ALIGNMENT_DARV_SET_STATUS', status });
export const setDARVGuider = guider => ({ type: 'POLAR_ALIGNMENT_SET_DARV_GUIDER', guider });

export const startDARV = (shotParameters) => (dispatch, getState) => {
    const { exposure } = shotParameters;
    const guidingTimeForDirection = (exposure - 5.0)/2.0
    if(exposure < 30) {
        return dispatch(addNotification('DARV Polar Alignment', 'Exposure should be at least 30 seconds', 'warning', 10000));
    }
    const guider = getSelectedGuider(getState());
    if(guider !== 'Manual') {
        startDARVGuiding(dispatch, guider, { exposure }, () => {});
    }
    dispatch(setDARVStatus('started'));
    setTimeout(() => dispatch(setDARVStatus('guiding_west')), 5000);
    setTimeout(() => dispatch(setDARVStatus('guiding_east')), (5 + guidingTimeForDirection) * 1000 );
    setTimeout(() => dispatch(setDARVStatus('idle')), exposure * 1000);

    return dispatch(shoot(shotParameters));
};


