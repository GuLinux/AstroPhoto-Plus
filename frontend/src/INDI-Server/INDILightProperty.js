import React from 'react';
import INDILight from './INDILight'
import { Grid } from 'semantic-ui-react'

const INDILightProperty = ({property}) => (
    <span>
        {property.values.map(value => ( <INDILight key={value.name} state={value.value} text={value.label} /> ) )}
    </span>
)

export default INDILightProperty
