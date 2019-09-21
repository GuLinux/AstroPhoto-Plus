import { createSelector } from 'reselect';
import { getServerName, getAutoguiderEngine } from '../Settings/selectors';

export const homeSelector = createSelector([getServerName, getAutoguiderEngine],
    (serverName, autoguiderEngine) => ({
        serverName,
        autoguiderEngine,
    })
);
