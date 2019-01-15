import { createSelector } from 'reselect';
import { imageUrlBuilder } from '../utils';
import { get } from 'lodash';

const getImageState= state => state.image;

export const imageSelector = createSelector([
    getImageState,
    (state, ownProps) => ownProps,
], ({options}, ownProps) => {
    if(!ownProps.id) {
        return {};
    }
    const { maxWidth, stretch, clipLow, clipHigh, format } = options;
    const type = get(ownProps, 'type', 'main');

    return {
        id: ownProps.id,
        type,
        uri: imageUrlBuilder(ownProps.id, {
            type,
            maxWidth,
            stretch,
            clipLow,
            clipHigh,
            format,
        }),
        options,
    };
});

export const imageSectionMenuSelector = createSelector([getImageState], ({options}) => ({options}));

export const imageViewOptionsSelector = createSelector([getImageState],
    ({options}) => ({options}));

export const histogramSelector = createSelector([getImageState],
    ({options, histogram}) => ({
        histogramEnabled: options.showHistogram,
        histogram: histogram,
        logarithmic: options.histogramLogarithmic,
        bins: options.histogramBins,
    })
);