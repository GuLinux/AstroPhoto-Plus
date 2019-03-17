import { createSelector } from 'reselect';
import { getServerName } from '../Settings/selectors';
import { get } from 'lodash';

export const getFrontendVersion = state => get(state, 'app.frontend.version');

export const appSelector = createSelector(getServerName, serverName => ({ serverName }));