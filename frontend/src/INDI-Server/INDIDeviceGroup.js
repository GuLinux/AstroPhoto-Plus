import React from 'react';
import { INDITextPropertyContainer, INDINumberPropertyContainer, INDISwitchPropertyContainer, INDILightPropertyContainer } from './INDIPropertyContainer';
import { Grid, Label} from 'semantic-ui-react'
import { INDILight } from './INDILight';

const getPropertyComponent = property => {
    switch(property.type) {
        case "text":
            return ( <INDITextPropertyContainer   key={property.id} propertyId={property.id} /> );
        case "number":
            return ( <INDINumberPropertyContainer key={property.id} propertyId={property.id} /> );
        case "switch":
            return ( <INDISwitchPropertyContainer key={property.id} propertyId={property.id} /> );
        case "light":
            return ( <INDILightPropertyContainer  key={property.id} propertyId={property.id} /> );
        default:
            // TODO: render blob in some way?
            return ( <span key={property.id}>Unsupported {property.type} property {property.label} ({property.name})</span> );
    }
}

const INDIPropertyRow = ({property, children}) => (
    <Grid.Row>
        <Grid.Column verticalAlign="middle" width={2}><INDILight state={property.state} /></Grid.Column>
        <Grid.Column verticalAlign="middle" width={2}><Label content={property.label} /></Grid.Column>
        <Grid.Column verticalAlign="middle" width={12}>
            {children}
        </Grid.Column>
    </Grid.Row>
)

export const INDIDeviceGroup = ({group, properties}) => (
    <Grid container stackable>
        {
            properties.map(
                property => (
                    <INDIPropertyRow key={property.id} property={property}>
                        {getPropertyComponent(property)}
                    </INDIPropertyRow>
                )
            )
        }
    </Grid>
)

