import { Button } from 'react-bootstrap'
import React from 'react';

const CommitPendingValuesButton = ({isWriteable, commitPendingValues, bsStyle, size}) => {
    if(!isWriteable)
        return null;
    return (
        <Button
            bsStyle={bsStyle}
            bsSize={size}
            onClick={e => commitPendingValues()}
            >set</Button>
    )
}

export default CommitPendingValuesButton
