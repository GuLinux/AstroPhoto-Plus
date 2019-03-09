import { createSelector } from 'reselect'
import { isError } from '../Errors/selectors';
import { Routes } from '../routes';
import { getServerName } from '../Settings/selectors';

const getLandingPaths = state => state.navigation.landingPaths;

const getLandingPath = (state, props) => getLandingPaths(state)[props.route] || props.defaultLandingPath;

export const makeHistoryLandingSelector = () => createSelector([getLandingPath], landingPath => ({ landingPath }));

export const navbarContainerSelector = createSelector([
    isError,
    getServerName,
    (_, props) => props.location,
], (isError, serverName, location) => ({
    disableNavbar: isError || location.pathname === Routes.ROOT,
    serverName
}));

