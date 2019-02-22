import Actions from '../actions';
import { fetch } from './polyfills';
import { normalize } from 'normalizr';
import { commandsSchema, sequenceSchema, sequenceListSchema, sequenceJobSchema } from './schemas'

export class API {
    static backendURL = null;
    static setBackendURL = url => API.backendURL = url;
    static getFullURL = url => API.backendURL + url;
}

export const isJSON = response => response.headers.has('content-type') && response.headers.get('content-type') === 'application/json';
const headersJSONRequest = {
    'Content-Type': 'application/json',
};

export const apiFetch = async (url, options) => {
    const response = await fetch(API.getFullURL(url), options);

    let reply = { response };
    if(isJSON(response)) {
        reply.json = await response.json();
    } else {
        reply.text = await response.text();
    }
    return response.ok ? Promise.resolve(reply) : Promise.reject(reply);
}


// TODO: refactor using apiFetch
const fetchJSON = async (dispatch, url, options, onSuccess, onError) => {
    const dispatchError = response => {
        response.text().then( body => { dispatch(Actions.Server.error('network_request', 'response', response, body)) })
    }

    const errorHandler = response => {
        if(onError) {
            const errorWasHandled = onError(response, isJSON(response));
            if(errorWasHandled) {
                return;
            }
        }
        dispatchError(response);
    }
    try {
        const response = await fetch(API.getFullURL(url), options);
        if(! response.ok) {
            throw response;
        }
        const json = await response.json();
        onSuccess(json);
    } catch(error) {
        if('status' in error) {
            errorHandler(error)
        } else {
            dispatch(Actions.Server.error('network_request', 'exception', error))
        }
    }
}

export const fetchBackendVersion = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/version', {}, json => onSuccess(json));

export const startSequenceAPI = (dispatch, sequence, onSuccess, onError) => fetchJSON(dispatch, `/api/sequences/${sequence.id}/start`, {
        method: 'POST',
    }, json => onSuccess(json), onError);


export const stopSequenceAPI = (dispatch, sequence, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequence.id}/stop`, {
        method: 'POST',
    }, json => onSuccess(json));

export const resetSequenceAPI = (dispatch, sequenceId, options, onSuccess) => {
    return fetchJSON(dispatch, `/api/sequences/${sequenceId}/reset`, {
        method: 'POST',
        body: JSON.stringify(options),
        headers: headersJSONRequest,
    }, json => onSuccess(normalize(json, sequenceSchema)));
}


export const duplicateSequenceAPI = (dispatch, sequence, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequence.id}/duplicate`, {
        method: 'POST',
    }, json => onSuccess(normalize(json, sequenceSchema)));


export const importSequenceAPI = (dispatch, data, onSuccess) => fetchJSON(dispatch, '/api/sequences/import', {
        method: 'POST',
        body: data,
        headers: headersJSONRequest,
    }, json => onSuccess(normalize(json, sequenceSchema)));



export const fetchSequencesAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/sequences', {}, json => onSuccess(normalize(json, sequenceListSchema)));

export const createSequenceAPI = (dispatch, sequence, onSuccess) => fetchJSON(dispatch, '/api/sequences', {
        method: 'POST',
        headers: headersJSONRequest,
        body: JSON.stringify(sequence)
    }, json => onSuccess(normalize(json, sequenceSchema)));

export const editSequenceAPI = (dispatch, sequence, onSuccess) => fetchJSON(dispatch, '/api/sequences/' + sequence.id, {
        method: 'PUT',
        headers: headersJSONRequest,
        body: JSON.stringify(sequence)
    }, json => onSuccess(normalize(json, sequenceSchema)));



export const deleteSequenceAPI = (dispatch, sequenceId, options, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequenceId}?remove_files=${String(options.remove_files)}`, {
        method: 'DELETE'
    }, json => onSuccess(normalize(json, sequenceSchema)));


export const createSequenceJobAPI = (dispatch, sequenceJob, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequenceJob.sequence}/sequence_jobs`, {
        method: 'POST',
        headers: headersJSONRequest,
        body: JSON.stringify(sequenceJob)
    }, json => onSuccess(normalize(json, sequenceJobSchema)));

export const updateSequenceJobAPI = (dispatch, sequenceJob, onSuccess, onError) => fetchJSON(dispatch, `/api/sequences/${sequenceJob.sequence}/sequence_jobs/${sequenceJob.id}`, {
        method: 'PUT',
        headers: headersJSONRequest,
        body: JSON.stringify(sequenceJob)
    }, json => onSuccess(normalize(json, sequenceJobSchema)), onError);

export const moveSequenceJobAPI = (dispatch, sequenceJob, direction, onSuccess, onError) => fetchJSON(dispatch, `/api/sequences/${sequenceJob.sequence}/sequence_jobs/${sequenceJob.id}/move`, {
        method: 'PUT',
        headers: headersJSONRequest,
        body: JSON.stringify({ direction })
    }, json => onSuccess(normalize(json, sequenceSchema)), onError);


export const duplicateSequenceJobAPI = (dispatch, sequenceJob, onSuccess, onError) => fetchJSON(dispatch, `/api/sequences/${sequenceJob.sequence}/sequence_jobs/${sequenceJob.id}/duplicate`, {
        method: 'PUT',
    }, json => onSuccess(normalize(json, sequenceSchema)), onError);


export const deleteSequenceJobAPI = (dispatch, sequenceId, sequenceJobId, options, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequenceId}/sequence_jobs/${sequenceJobId}?remove_files=${String(options.remove_files)}`, {
        method: 'DELETE'
    }, json => onSuccess(normalize(json, sequenceSchema)));



export const autoloadConfigurationAPI = (dispatch, device, onSuccess, onError) => fetchJSON(dispatch, `/api/server/devices/${device}/properties/CONFIG_PROCESS`, {
        method: 'PUT',
        headers: headersJSONRequest,
        body: JSON.stringify({ CONFIG_LOAD: true }),
    }, onSuccess, onError);

export const autoconnectDeviceAPI = (dispatch, device, onSuccess, onError) => fetchJSON(dispatch, `/api/server/devices/${device}/properties/CONNECTION`, {
        method: 'PUT',
        headers: headersJSONRequest,
        body: JSON.stringify({ CONNECT: true }),
    }, onSuccess, onError);


export const getINDIServerStatusAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/server/status', {}, onSuccess);

export const setINDIServerConnectionAPI = (dispatch, connect, onSuccess) => fetchJSON(dispatch, `/api/server/${ connect ? 'connect' : 'disconnect'}`, { method: 'PUT'}, onSuccess);

export const getINDIDevicesAPI = (dispatch, onSuccess, onError) => fetchJSON(dispatch, '/api/server/devices', {}, onSuccess, onError);

export const getINDIDevicePropertiesAPI = (dispatch, device, onSuccess, onError) => fetchJSON(
    dispatch,
    `/api/server/devices/${device.name}/properties`,
    {},
    onSuccess,
    onError,
);

export const setINDIValuesAPI = (dispatch, device, property, values, onSuccess) => fetchJSON(dispatch, `/api/server/devices/${device.name}/properties/${property.name}`, {
        method: 'PUT',
        body: JSON.stringify(values),
        headers: headersJSONRequest,
    }, onSuccess);

export const getINDIServiceAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/indi_service', {}, onSuccess);
export const startINDIServiceAPI = (dispatch, drivers, onSuccess, onError) => fetchJSON(dispatch, '/api/indi_service/start', {
        method: 'POST',
        body: JSON.stringify({ drivers }),
        headers: headersJSONRequest,
    }, onSuccess, onError);
export const stopINDIServiceAPI = (dispatch, onSuccess, onError) => fetchJSON(dispatch, '/api/indi_service/stop', {
        method: 'POST',
    }, onSuccess, onError);


export const fetchINDIProfilesAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/indi_profiles', {}, json => onSuccess(json));
export const addINDIProfileAPI = (dispatch, data, onSuccess) => fetchJSON(dispatch, '/api/indi_profiles', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: headersJSONRequest,
}, json => onSuccess(json));
export const removeINDIProfileAPI = (dispatch, id, onSuccess) => fetchJSON(dispatch, '/api/indi_profiles/' + id, {
    method: 'DELETE',
}, json => onSuccess(json));

export const updateINDIProfileAPI = (dispatch, data, onSuccess) => fetchJSON(dispatch, '/api/indi_profiles/' + data.id, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: headersJSONRequest,
}, json => onSuccess(json));

export const cameraShootAPI = (dispatch, cameraId, data, onSuccess, onError) => fetchJSON(dispatch, `/api/cameras/${cameraId}/image`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: headersJSONRequest,
}, onSuccess, onError);


export const fetchHistogramApi = (dispatch, type, imageId, bins, onSuccess, onError) => {
    let uri = `/api/images/${type}/${imageId}/histogram?range_int=1`;
    if(bins)
        uri += `&bins=${bins}`;
    fetchJSON(dispatch, uri, {}, onSuccess, onError);
}

export const getSettingsApi = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/settings', {}, onSuccess);
export const updateSettingsApi = (dispatch, settings, onSuccess) => fetchJSON(dispatch, '/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
        headers: headersJSONRequest,
}, onSuccess);


export const downloadAstrometryIndexesApi = (dispatch, arcminutes, onSuccess, onError) => fetchJSON(
    dispatch,
    '/api/astrometry/download_indexes',
    {
        method: 'POST',
        body: JSON.stringify({ arcminutes }),
        headers: headersJSONRequest,
    },
    onSuccess,
    onError, 
);

export const getImages = (dispatch, type, onSuccess) => fetchJSON(dispatch, `/api/images/${type}`, {}, onSuccess);
export const searchImages = (dispatch, type, params, onSuccess) => fetchJSON(dispatch, `/api/images/${type}/search`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: headersJSONRequest,
}, onSuccess);


export const fetchCommandsAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/commands', {}, json => onSuccess(normalize(json, commandsSchema)));

export const solveFieldAPI = (dispatch, onSuccess, onError, astrometryDriver,options) => fetchJSON(dispatch, `/api/astrometry/${astrometryDriver}/solveField`, {
    method: 'POST',
    body: JSON.stringify(options),
    headers: headersJSONRequest,
}, onSuccess, onError);

