import { get } from 'lodash';

export const getFrontendVersion = state => get(state, 'app.frontend.version');
export const getBackendVersion = state => get(state, 'app.backend.version');


