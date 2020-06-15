import { telescopeGOTOAPI } from '../middleware/api';


export const telescopeGOTO = (telescope, ra, dec, equinox, onGotoCompleted) => dispatch => {
    dispatch({ type: 'TELESCOPE_GOTO', ra, dec, telescope, equinox });
    telescopeGOTOAPI(dispatch, telescope, {ra, dec, equinox, sync: true, onGotoCompleted });
}
