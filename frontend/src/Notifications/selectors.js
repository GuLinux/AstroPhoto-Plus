import { createSelector } from 'reselect';

export const notificationsSelector = createSelector([
    state => state.notifications.notifications,
    state => state.notifications.html5,
], (notifications, html5Enabled) => ({
    notifications,
    html5Enabled,
}));