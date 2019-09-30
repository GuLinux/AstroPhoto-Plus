import { createSelector } from 'reselect'
import { isError } from '../Errors/selectors';
import { Routes } from '../routes';
import { getServerName, getAutoguiderEngine } from '../Settings/selectors';
import createCachedSelector from 're-reselect';

const getLandingPaths = state => state.navigation.landingPaths;

const getLandingPath = (state, props) => getLandingPaths(state)[props.route] || props.defaultLandingPath;

export const historyLandingSelector = createCachedSelector([getLandingPath], landingPath => ({ landingPath }))((state, {route}) => route);

export const navbarContainerSelector = createSelector([
    isError,
    getServerName,
    getAutoguiderEngine,
    (_, props) => props.location,
], (isError, serverName, autoguiderEngine, location) => ({
    disableNavbar: isError || location.pathname === Routes.ROOT,
    serverName,
    autoguiderEngine,
}));

