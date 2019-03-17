import { createSelector } from 'reselect';
import { getServerName } from '../Settings/selectors';

// Moved here to avoid circular dependencies
export const appSelector = createSelector(getServerName, serverName => ({ serverName }));
