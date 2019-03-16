import { createSelector } from 'reselect';
import { get } from 'lodash';

const getStatus = state => state.autoguiding.status;

export const autoguidingSelector = createSelector([
    getStatus
], (status) => ({
    isRunning: get(status, 'is_running', false),
    serverAlreadyRunning: get(status, 'serverAlreadyRunning'),
    vncDisplay: get(status, 'display'),
}));
