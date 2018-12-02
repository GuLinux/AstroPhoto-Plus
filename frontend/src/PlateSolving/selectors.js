import { createSelector } from 'reselect'

import {
  connectedAstrometrySelector,
  connectedTelescopesSelector,
  connectedCamerasSelector,
} from '../Gear/selectors';
import { getMessages } from '../INDI-Server/selectors';
import { PlateSolving } from './actions';


const getPlateSolvingOptions = state => state.plateSolving.options;

const getSolution = state => state.plateSolving.solution;

export const plateSolvingContainerSelector = createSelector([
    connectedAstrometrySelector,
    connectedTelescopesSelector,
    connectedCamerasSelector,
    getMessages,
    getPlateSolvingOptions,
    getSolution,
    state => state.plateSolving.loading,
], (astrometryDrivers, telescopes, cameras, messages, options, solution, loading) => ({
    astrometryDrivers,
    telescopes,
    cameras,
    messages: messages[options.astrometryDriver],
    options,
    solution,
    loading,
    isManualFOV: options[PlateSolving.Options.fovSource] === 'manual',
}));

export const plateSolvingSectionMenuSelector = createSelector([getPlateSolvingOptions], options => ({
    listenToCamera: options[PlateSolving.Options.camera],
}))

export const solveFromCameraSelector = createSelector([getPlateSolvingOptions], options => ({options}));

export const plateSolvingPageContainerSelector = createSelector([connectedAstrometrySelector, connectedTelescopesSelector], (astrometryDrivers, telescopes) => ({
    hasAstrometry: astrometryDrivers.all.length > 0,
    hasTelescopes: telescopes.all.length > 0,
}));

