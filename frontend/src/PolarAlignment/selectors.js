import { createSelector } from 'reselect';
import { getConnectedGuiders } from '../Gear/selectors';
import { cameraContainerSelector } from '../Camera/selectors';

export const getSelectedGuider = state => state.polarAlignment.darv.selectedGuider;

export const getDARVSelector = createSelector(getConnectedGuiders, getSelectedGuider, cameraContainerSelector, (guiders, selectedGuider, cameraOptions) => ({guiders, selectedGuider, ...cameraOptions}));

