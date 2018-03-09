import { normalize, schema } from 'normalizr'
import fetch from 'isomorphic-fetch'

const sequenceSchema = new schema.Entity('sequences');
const sessionSchema = new schema.Entity('sessions', {
    sequences: [ sequenceSchema ]
});
const sessionList = [ sessionSchema ]

export const fetchSessionsAPI = (onSuccess, onError) => {
    return fetch('/api/sessions')
        .then(response => response.json(), onError)
        .then(json => {
            let data = normalize(json, sessionList);
            onSuccess(data);
        })
}

export const createSessionAPI = (session, onSuccess, onError) => {
    return fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(session)
    }).then(response => response.json(), onError)
    .then(json => {
        let data = normalize(json, sessionSchema);
        onSuccess(data);
    })
}

export const deleteSessionAPI = (sessionId, onSuccess, onError) => {
    return fetch('/api/sessions/' + sessionId, {
        method: 'DELETE'
    }).then(response => response.json(), onError)
    .then(json => {
console.log(json);
        let data = normalize(json, sessionSchema);
        onSuccess(data);
    })
}


export const createSequenceAPI = (sequence, onSuccess, onError) => {
    return fetch('/api/sessions/' + sequence.session + '/sequences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: sequence.name})
    }).then(response => response.json(), onError)
    .then(json => {
        let data = normalize(json, sequenceSchema);
        onSuccess(data);
    })
}

export const getINDIServerStatusAPI = (onSuccess, onError) => {
    return fetch('/api/server/status').then(response => response.json(), onError)
    .then(json => {
        onSuccess(json);
    })
}

export const setINDIServerConnectionAPI = (connect, onSuccess, onError) => {
    let endpoint = connect ? '/api/server/connect' : '/api/server/disconnect';
    return fetch(endpoint, { method: 'PUT'}).then(response => response.json(), onError)
    .then(json => {
        onSuccess(json);
    })
}

export const getINDIDevicesAPI = (onSuccess, onError) => {
    return fetch('/api/server/devices').then(response => response.json(), onError).then(json => onSuccess(json))
    
}
