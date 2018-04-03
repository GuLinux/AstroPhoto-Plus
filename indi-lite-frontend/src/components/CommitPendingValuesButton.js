import { Button } from 'react-bootstrap'
import React from 'react';

const CommitPendingValuesButton = ({device, property, pendingValues, isWriteable, commitPendingValues, bsStyle, size}) => {
    if(!isWriteable)
        return null;
    return (
        <Button
            bsStyle={bsStyle}
            bsSize={size}
            onClick={e => commitPendingValues(device, property, pendingValues)}
            >set</Button>
    )
}

export default CommitPendingValuesButton
