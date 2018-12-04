import React from 'react';
import { Label } from 'semantic-ui-react'

const states = {
    IDLE: { color: 'grey', text: 'idle', icon: 'dot circle outline'},
    OK: { color: 'green', text: 'ok', icon: 'check circle outline' },
    BUSY: { color: 'orange', text: 'busy', icon: 'hourglass' },
    CHANGED_BUSY: { color: 'brown', text: 'busy', icon: 'hourglass' },
    ALERT: { color: 'red', text: 'alert', icon: 'exclamation' },
}


export const INDILight = ({state, text}) => (
    <Label color={states[state].color} icon={states[state].icon} content={text ? text : states[state].text} />
)

