import React from 'react';
import CommitPendingValuesButton from './CommitPendingValuesButton'
import INDILight from './INDILight';
import INDIText from './INDIText';
import { Grid } from 'semantic-ui-react'

const INDITextProperty = ({property, isWriteable, pendingValues, displayValues, addPendingValues, commitPendingValues }) => (
    <Grid>
        <Grid.Column width={14}>
            {property.values.map( (value, index) =>
                <INDIText key={index} value={value} isWriteable={isWriteable} displayValue={displayValues[value.name]} addPendingValues={addPendingValues} />
            )}
        </Grid.Column>
        <Grid.Column width={2} verticalAlign='middle'>
            <CommitPendingValuesButton primary size="mini" isWriteable={isWriteable} commitPendingValues={commitPendingValues} />
        </Grid.Column>
    </Grid>
)

export default INDITextProperty
