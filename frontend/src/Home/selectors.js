import { createSelector } from 'reselect';
import { getServerName } from '../Settings/selectors';

export const homeSelector = createSelector([getServerName], serverName => ({ serverName }));