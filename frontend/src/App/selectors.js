import { createSelector } from 'reselect';
import { getServerName } from '../Settings/selectors';

export const appSelector = createSelector(getServerName, serverName => ({ serverName }));