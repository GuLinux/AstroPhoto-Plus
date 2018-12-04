import { createSelector } from 'reselect'

const getLandingPaths = state => state.navigation.landingPaths;

const getLandingPath = (state, props) => getLandingPaths(state)[props.route] || props.defaultLandingPath;

export const makeHistoryLandingSelector = () => createSelector([getLandingPath], landingPath => ({ landingPath }));

