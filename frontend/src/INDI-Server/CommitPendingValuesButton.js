import { Button } from 'semantic-ui-react'
import React from 'react';

const CommitPendingValuesButton = ({isWriteable, commitPendingValues, primary, size}) => {
    if(!isWriteable)
        return null;
    return (
        <Button
            primary={primary}
            size={size}
            onClick={e => commitPendingValues()}
            >set</Button>
    )
}

export default CommitPendingValuesButton
