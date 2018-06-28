const defaultState = {
    maxWidth: 0,
    stretch: true,
    clipLow: 0,
    clipHigh: 100,
    format: 'png',
};

const image = (state = defaultState, action) => {
    switch(action.type) {
        case 'IMAGE_SET_OPTION':
            return {...state, ...action.option};
        default:
            return state;
    }
}

export default image;
