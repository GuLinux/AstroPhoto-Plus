const defaultState = {
    options: {
        maxWidth: 0,
        stretch: true,
        clipLow: 0,
        clipHigh: 100,
        format: 'png',
        fitToScreen: true,
        showHistogram: false,
        histogramBins: 255,
    }

};

const image = (state = defaultState, action) => {
    switch(action.type) {
        case 'IMAGE_SET_OPTION':
            return {...state, options: {...state.options, ...action.option}};
        case 'IMAGE_LOAD_HISTOGRAM':
            return {...state, histogram: { loading: true }};
        case 'IMAGE_HISTOGRAM_LOADED':
            return {...state, histogram: action.histogram }
        case 'IMAGE_HISTOGRAM_ERROR':
            return {...state, histogram: { error: action.error }};
        default:
            return state;
    }
}

export default image;
