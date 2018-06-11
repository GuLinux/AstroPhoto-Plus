import React from 'react';
import CommitPendingValuesButton from './CommitPendingValuesButton'
import INDINumber from './INDINumber'
import { Grid } from 'semantic-ui-react'



const INDINumberProperty = ({property, isWriteable, pendingValues, displayValues, addPendingValues, commitPendingValues }) => (
    <Grid>
        <Grid.Column width={14}>
            {property.values.map( (value, index) =>
                <INDINumber key={index} value={value} addPendingValues={addPendingValues} displayValue={displayValues[value.name]} isWriteable={isWriteable} />
            )}
        </Grid.Column>
        <Grid.Column width={2} verticalAlign='middle'>
            <CommitPendingValuesButton primary size="mini" isWriteable={isWriteable} commitPendingValues={commitPendingValues} />
        </Grid.Column>
    </Grid>
)

export default INDINumberProperty
