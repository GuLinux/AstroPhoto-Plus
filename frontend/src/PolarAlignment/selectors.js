import { createSelector } from 'reselect';
import { getConnectedGuiders } from '../Gear/selectors';
import { cameraContainerSelector } from '../Camera/selectors';

export const getSelectedGuider = state => state.polarAlignment.darv.selectedGuider;
export const getDARVStatus = state => state.polarAlignment.darv.status;

export const getDARVSelector = createSelector(
    getConnectedGuiders,
    getSelectedGuider,
    cameraContainerSelector,
    getDARVStatus,
    (guiders, selectedGuider, cameraOptions, darvStatus) => ({guiders, selectedGuider, darvStatus, ...cameraOptions}));

