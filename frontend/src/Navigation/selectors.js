import { createSelector } from 'reselect'
import { isError } from '../Errors/selectors';
import { Routes } from '../routes';

const getLandingPaths = state => state.navigation.landingPaths;

const getLandingPath = (state, props) => getLandingPaths(state)[props.route] || props.defaultLandingPath;

export const makeHistoryLandingSelector = () => createSelector([getLandingPath], landingPath => ({ landingPath }));

export const navbarContainerSelector = createSelector([
    isError,
    (_, props) => props.location,
], (isError, location) => ({
    disableNavbar: isError || location.pathname === Routes.ROOT,
}));

