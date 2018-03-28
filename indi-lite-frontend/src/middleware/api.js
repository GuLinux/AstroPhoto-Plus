import { normalize, schema } from 'normalizr'
import fetch from 'isomorphic-fetch'

const sequenceSchema = new schema.Entity('sequences');
const sessionSchema = new schema.Entity('sessions', {
    sequences: [ sequenceSchema ]
});
const sessionList = [ sessionSchema ]

const fetchJSON = (url, options, onSuccess, onError) => fetch(url, options)
                                                    .then(response => {
                                                        if(! response.ok)
                                                            throw response;
                                                        return response.json();
                                                    })
                                                    .then(onSuccess)
                                                    .catch(error => onError(error));

export const fetchSessionsAPI = (onSuccess, onError) => fetchJSON('/api/sessions', {}, json => onSuccess(normalize(json, sessionList)), onError);

export const createSessionAPI = (session, onSuccess, onError) => fetchJSON('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(session)
    }, json => onSuccess(normalize(json, sessionSchema)), onError);

export const deleteSessionAPI = (sessionId, onSuccess, onError) => fetchJSON(`/api/sessions/${sessionId}`, {
        method: 'DELETE'
    }, json => onSuccess(normalize(json, sessionSchema)), onError);


export const createSequenceAPI = (sequence, onSuccess, onError) => fetchJSON(`/api/sessions/${sequence.session}/sequences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: sequence.name})
    }, json => onSuccess(normalize(json, sequenceSchema)), onError);

export const getINDIServerStatusAPI = (onSuccess, onError) => fetchJSON('/api/server/status', {}, onSuccess, onError);

export const setINDIServerConnectionAPI = (connect, onSuccess, onError) => fetchJSON(`/api/server/${ connect ? 'connect' : 'disconnect'}`, { method: 'PUT'}, onSuccess, onError);

export const getINDIDevicesAPI = (onSuccess, onError) => fetchJSON('/api/server/devices', {}, onSuccess, onError);

export const getINDIDevicePropertiesAPI = (device, onSuccess, onError) => fetchJSON(`/api/server/devices/${device.name}/properties`, {}, onSuccess, onError);

export const setINDIValuesAPI = (device, property, pendingValues, onSuccess, onError) => fetchJSON(`/api/server/devices/${device.name}/properties/${property.name}`, {
        method: 'PUT',
        body: JSON.stringify(pendingValues),
        headers: {
            'Content-Type': 'application/json'
        },
    }, onSuccess, onError);
