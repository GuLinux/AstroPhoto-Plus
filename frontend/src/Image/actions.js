import { fetchHistogramApi } from "../middleware/api";
import Actions from '../actions';

const Image = {
    setOption: (option) => ({ type: 'IMAGE_SET_OPTION', option }),

    loadHistogram: (imageId, imageType, bins) => (dispatch) => {
        dispatch({type: 'IMAGE_LOAD_HISTOGRAM'});
        return fetchHistogramApi(dispatch, imageType, imageId, bins,
                (data) => dispatch(Image.histogramLoaded(data)),
                (err) => {
                    if(err.headers.get('Content-Type') === 'application/json') {
                        err.json().then( (errorData) => dispatch(Image.histogramError(errorData)) );
                        return true;
                    }
                    return false;
                }
        )
    },

    histogramLoaded: (histogram) => ({ type: 'IMAGE_HISTOGRAM_LOADED', histogram}),
    histogramError: (dispatch, error) => {
        dispatch({ type: 'IMAGE_HISTOGRAM_ERROR', error });
        let errorMessage = [
            'There was an error creating the histogram data.',
        ];
        if(error.error_message) {
            errorMessage.push(error.error_message);
        }
        dispatch(Actions.Notifications.add('Histogram error', errorMessage , 'error'));
    },



};

export default Image;

