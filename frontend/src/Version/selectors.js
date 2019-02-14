import { createSelector } from 'reselect';
import { get } from 'lodash';

export const versionCheckSelector = createSelector([
    state => state.version,
], (version) => {
    const backendVersion = get(version, 'backend.version');
    const needsRefresh = backendVersion && get(version, 'frontend.version') !== backendVersion;
    return {
       needsRefresh,
    }
});
