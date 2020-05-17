import { get } from 'lodash';
import { createSelector } from 'reselect';

export const getFrontendVersion = state => get(state, 'app.frontend.version');
export const getBackendVersion = state => get(state, 'app.backend.version');

const getTimeSyncModalDismissed = state => state.app.timeSyncModalDismissed;
const getTimeSyncNeeded = state => state.app.timeSyncNeeded;

export const timeSyncModalSelector = createSelector([getTimeSyncModalDismissed, getTimeSyncNeeded], (timeSyncModalDismissed, timeSyncNeeded) => ({ 
    showTimeSyncModal: timeSyncNeeded && ! timeSyncModalDismissed,
}));


