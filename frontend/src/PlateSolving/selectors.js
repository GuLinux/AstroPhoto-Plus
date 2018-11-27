import { createSelector } from 'reselect'

import {
  connectedAstrometrySelector,
  connectedTelescopesSelector,
  connectedCamerasSelector,
} from '../Gear/selectors';
import { getMessages } from '../INDI-Server/selectors';
import { PlateSolving } from './actions';


const getPlateSolvingOptions = state => state.plateSolving.options;

export const plateSolvingContainerSelector = createSelector([
    connectedAstrometrySelector,
    connectedTelescopesSelector,
    connectedCamerasSelector,
    getMessages,
    getPlateSolvingOptions,
    state => state.plateSolving.solution,
    state => state.plateSolving.loading,
], (astrometryDrivers, telescopes, cameras, messages, options, solution, loading) => ({
    astrometryDrivers,
    telescopes,
    cameras,
    messages: messages[options.astrometryDriver],
    options,
    solution,
    loading,
}));

export const plateSolvingSectionMenuSelector = createSelector([getPlateSolvingOptions], options => ({
    listenToCamera: options[PlateSolving.Options.camera],
}))

export const solveFromCameraSelector = createSelector([getPlateSolvingOptions], options => ({options}));

