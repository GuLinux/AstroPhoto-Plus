import { createSelector } from 'reselect';
import { getCurrentSettings } from '../Settings/selectors';
import { get } from 'lodash';

const isDitheringEnabled = state => get(getCurrentSettings(state), 'dithering_enabled', false);

export const getDitheringOptionsSelector = createSelector([
    isDitheringEnabled,
], (isDitheringEnabled) => ({
    isDitheringEnabled: !!isDitheringEnabled,
}));
