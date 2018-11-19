import { createSelector } from 'reselect'

import {
  connectedAstrometrySelector,
  connectedTelescopesSelector,
  connectedCamerasSelector,
} from '../Gear/selectors';
import { getMessages } from '../INDI-Server/selectors';

export const plateSolvingContainerSelector = createSelector([
    connectedAstrometrySelector,
    connectedTelescopesSelector,
    connectedCamerasSelector,
    getMessages,
    state => state.plateSolving.options,
], (astrometryDrivers, telescopes, cameras, messages, options) => ({
    astrometryDrivers,
    telescopes,
    cameras,
    messages: messages[options.astrometryDriver],
    options,
}));
