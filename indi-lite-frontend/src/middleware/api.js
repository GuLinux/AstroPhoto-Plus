import { normalize, schema } from 'normalizr'
import fetch from 'isomorphic-fetch'
import Actions from '../actions'

const sequenceSchema = new schema.Entity('sequences');
const sessionSchema = new schema.Entity('sessions', {
    sequences: [ sequenceSchema ]
});
const sessionList = [ sessionSchema ]

const fetchJSON = (dispatch, url, options, onSuccess) => fetch(url, options)
                                                    .then(response => {
                                                        if(! response.ok)
                                                            throw response;
                                                        return response.json();
                                                    }).then(onSuccess)
                                                    .catch(error => {
                                                        if('status' in error) {
                                                            console.log(error);
                                                            error.text().then( body => {
                                                                dispatch(Actions.serverError('network_request', 'response', error, body))
                                                            })
                                                        } else {
                                                            dispatch(Actions.serverError('network_request', 'exception', error))
                                                        }
                                                    });

export const fetchSessionsAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/sessions', {}, json => onSuccess(normalize(json, sessionList)));

export const createSessionAPI = (dispatch, session, onSuccess) => fetchJSON(dispatch, '/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(session)
    }, json => onSuccess(normalize(json, sessionSchema)));

export const deleteSessionAPI = (dispatch, sessionId, onSuccess) => fetchJSON(dispatch, `/api/sessions/${sessionId}`, {
        method: 'DELETE'
    }, json => onSuccess(normalize(json, sessionSchema)));


export const createSequenceAPI = (dispatch, sequence, onSuccess) => fetchJSON(dispatch, `/api/sessions/${sequence.session}/sequences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: sequence.name})
    }, json => onSuccess(normalize(json, sequenceSchema)));

export const getINDIServerStatusAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/server/status', {}, onSuccess);

export const setINDIServerConnectionAPI = (dispatch, connect, onSuccess) => fetchJSON(dispatch, `/api/server/${ connect ? 'connect' : 'disconnect'}`, { method: 'PUT'}, onSuccess);

export const getINDIDevicesAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/server/devices', {}, onSuccess);

export const getINDIDevicePropertiesAPI = (dispatch, device, onSuccess) => fetchJSON(dispatch, `/api/server/devices/${device.name}/properties`, {}, onSuccess);

export const setINDIValuesAPI = (dispatch, device, property, pendingValues, onSuccess) => fetchJSON(dispatch, `/api/server/devices/${device.name}/properties/${property.name}`, {
        method: 'PUT',
        body: JSON.stringify(pendingValues),
        headers: {
            'Content-Type': 'application/json'
        }
    }, onSuccess);
