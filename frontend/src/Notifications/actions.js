import { getDesktopNotificationsUuid } from './selectors';
import { apiFetch, headersJSONRequest } from '../middleware/api';

export const addNotification = (title, text, type, timeout, isModal=false) => (dispatch, getState) => {
    const desktopNotificationsUuid = getDesktopNotificationsUuid(getState());
    if(desktopNotificationsUuid) {
        apiFetch('/api/desktopNotifications', {
            method: 'POST',
            body: JSON.stringify({ desktopNotificationsUuid, title, text, type, timeout, isModal }),
            headers: headersJSONRequest,
        });
    } else {
        return dispatch({ type: 'NOTIFICATION_ADDED', notification: {title, text, type, timeout, isModal} });
    }
};

export const removeNotification = notification => ({ type: 'NOTIFICATION_REMOVED', notification });

export const setDesktopNotificationsUuid = uuid => ({ type: 'NOTIFICATIONS_DESKTOP_UUID', uuid });

export const onHTML5Blocked = () => {
    console.log('******* HTML5 Blocked');
    return { type: 'NOTIFICATIONS_HTML5_BLOCKED' };
}

export const Notifications = {
    add: addNotification,
    remove: removeNotification,
    html5Blocked: onHTML5Blocked,
};

