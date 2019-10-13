import { createSelector } from 'reselect';

export const getDesktopNotificationsUuid = state => state.notifications.desktopNotificationsUuid;

export const notificationsSelector = createSelector([
    state => state.notifications.notifications,
    state => state.notifications.html5,
    getDesktopNotificationsUuid,
], (notifications, html5Enabled, desktopNotificationsUuid) => ({
    notifications,
    html5Enabled,
    desktopNotificationsUuid,
}));
