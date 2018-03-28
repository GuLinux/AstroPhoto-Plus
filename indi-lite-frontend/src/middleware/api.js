import { normalize, schema } from 'normalizr'
import fetch from 'isomorphic-fetch'
import Actions from '../actions'

const sequenceSchema = new schema.Entity('sequences');
const sessionSchema = new schema.Entity('sessions', {
    sequences: [ sequenceSchema ]
});
const sessionList = [ sessionSchema ]

const fetchJSON = (dispatch, url, options) => fetch(url, options)
                                                    .then(response => {
                                                        if(! response.ok)
                                                            throw response;
                                                        return response.json();
                                                    })
                                                    .catch(error => dispatch(Actions.serverError('network_request', 'status' in error ? 'response' : 'exception', error)) );

export const fetchSessionsAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/sessions', {}).then(json => onSuccess(normalize(json, sessionList)));

export const createSessionAPI = (dispatch, session, onSuccess) => fetchJSON(dispatch, '/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(session)
    }).then(json => onSuccess(normalize(json, sessionSchema)));

export const deleteSessionAPI = (dispatch, sessionId, onSuccess) => fetchJSON(dispatch, `/api/sessions/${sessionId}`, {
        method: 'DELETE'
    }).then(json => onSuccess(normalize(json, sessionSchema)));


export const createSequenceAPI = (dispatch, sequence, onSuccess) => fetchJSON(dispatch, `/api/sessions/${sequence.session}/sequences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: sequence.name})
    }).then(json => onSuccess(normalize(json, sequenceSchema)));

export const getINDIServerStatusAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/server/status', {}).then(onSuccess);

export const setINDIServerConnectionAPI = (dispatch, connect, onSuccess) => fetchJSON(dispatch, `/api/server/${ connect ? 'connect' : 'disconnect'}`, { method: 'PUT'}).then(onSuccess);

export const getINDIDevicesAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/server/devices', {}).then(onSuccess);

export const getINDIDevicePropertiesAPI = (dispatch, device, onSuccess) => fetchJSON(dispatch, `/api/server/devices/${device.name}/properties`, {}).then(onSuccess);

export const setINDIValuesAPI = (dispatch, device, property, pendingValues, onSuccess) => fetchJSON(dispatch, `/api/server/devices/${device.name}/properties/${property.name}`, {
        method: 'PUT',
        body: JSON.stringify(pendingValues),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(onSuccess);
