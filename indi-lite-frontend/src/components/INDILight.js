import React from 'react';
import { Label } from 'react-bootstrap'

const states = {
    IDLE: { style: 'default', text: 'idle' },
    OK: { style: 'success', text: 'ok' },
    BUSY: { style: 'warning', text: 'busy' },
    ALERT: { style: 'danger', text: 'alert' },
}


const INDILight = ({state, text}) => (
            <Label bsStyle={states[state].style}>{text ? text : states[state].text}</Label>
)
 
export default INDILight
