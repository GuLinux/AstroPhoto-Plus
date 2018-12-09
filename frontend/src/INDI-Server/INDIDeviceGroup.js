import React from 'react';
import { Grid } from 'semantic-ui-react'
import { INDIPropertyRowContainer } from './INDIPropertyRowContainer';

export class INDIDeviceGroup extends React.PureComponent {
    renderPropertyRow = (property) => <INDIPropertyRowContainer propertyId={property} key={property} />;

    render = () => this.props.group ? (
        <Grid container stackable>
            { this.props.group.properties.map(this.renderPropertyRow)}
        </Grid>
    ) : null;
}


