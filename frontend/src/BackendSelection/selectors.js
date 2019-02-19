import { createSelector } from 'reselect';

export const backendSelectionSelector = createSelector([
    state => state.backendSelection.address,
], (address) => ({
    address,
}));