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
console.log(session);
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
