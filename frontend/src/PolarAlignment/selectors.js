import { createSelector } from 'reselect';
import { getConnectedGuiders, getGuiderWEProperty } from '../Gear/selectors';
import { cameraContainerSelector } from '../Camera/selectors';

export const getSelectedGuider = state => state.polarAlignment.darv.selectedGuider;
export const getDARVStatus = state => state.polarAlignment.darv.status;

export const getDARVSelector = createSelector(
    getConnectedGuiders,
    getSelectedGuider,
    cameraContainerSelector,
    getDARVStatus,
    (guiders, guiderId, cameraOptions, darvStatus, guiderWEProperty) => ({guiders, guiderId, darvStatus, ...cameraOptions}));

export const darvGuiderWarningsSelector = createSelector([getGuiderWEProperty], guiderWEProperty => ({
    state: guiderWEProperty && guiderWEProperty.state,
}));

