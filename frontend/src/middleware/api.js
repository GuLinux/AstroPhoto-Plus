import { normalize, schema } from 'normalizr'
import fetch from 'isomorphic-fetch'
import Actions from '../actions'

const sequenceItemSchema = new schema.Entity('sequenceItems', {}, {
    idAttribute: 'id',
    processStrategy: (v, p) => ({...v, sequence: p.id} ),

});
const sequenceSchema = new schema.Entity('sequences', {
        sequenceItems: [ sequenceItemSchema ]
    }, {
        idAttribute: 'id',
    }
);
const sequenceList = [ sequenceSchema ]

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

export const fetchSequencesAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/sequences', {}, json => onSuccess(normalize(json, sequenceList)));

export const createSequenceAPI = (dispatch, sequence, onSuccess) => fetchJSON(dispatch, '/api/sequences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sequence)
    }, json => onSuccess(normalize(json, sequenceSchema)));

export const deleteSequenceAPI = (dispatch, sequenceId, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequenceId}`, {
        method: 'DELETE'
    }, json => onSuccess(normalize(json, sequenceSchema)));


export const createSequenceItemAPI = (dispatch, sequenceItem, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequenceItem.sequence}/sequence_items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sequenceItem)
    }, json => onSuccess(normalize(json, sequenceItemSchema)));

export const updateSequenceItemAPI = (dispatch, sequenceItem, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequenceItem.sequence}/sequence_items/${sequenceItem.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sequenceItem)
    }, json => onSuccess(normalize(json, sequenceItemSchema)));


export const getINDIServerStatusAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/server/status', {}, onSuccess);

export const setINDIServerConnectionAPI = (dispatch, connect, onSuccess) => fetchJSON(dispatch, `/api/server/${ connect ? 'connect' : 'disconnect'}`, { method: 'PUT'}, onSuccess);

export const getINDIDevicesAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/server/devices', {}, onSuccess);

export const getCamerasAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/cameras', {}, onSuccess);

export const getINDIDevicePropertiesAPI = (dispatch, device, onSuccess) => fetchJSON(dispatch, `/api/server/devices/${device.name}/properties`, {}, onSuccess);

export const setINDIValuesAPI = (dispatch, device, property, pendingValues, onSuccess) => fetchJSON(dispatch, `/api/server/devices/${device.name}/properties/${property.name}`, {
        method: 'PUT',
        body: JSON.stringify(pendingValues),
        headers: {
            'Content-Type': 'application/json'
        }
    }, onSuccess);
