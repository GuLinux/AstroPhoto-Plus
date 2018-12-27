import React from 'react';
import { INDILight } from './INDILight';
import { INDITextPropertyContainer, INDINumberPropertyContainer, INDISwitchPropertyContainer, INDILightPropertyContainer } from './INDIPropertyContainer';
import { Grid, Label } from 'semantic-ui-react';

export class INDIPropertyRow extends React.PureComponent {

    renderPropertyContiner = () => {
        const { property: { id: propertyId, type, label, name } } = this.props;
        switch(type) {
            case "text":
                return ( <INDITextPropertyContainer   key={propertyId} propertyId={propertyId} /> );
            case "number":
                return ( <INDINumberPropertyContainer key={propertyId} propertyId={propertyId} /> );
            case "switch":
                return ( <INDISwitchPropertyContainer key={propertyId} propertyId={propertyId} /> );
            case "light":
                return ( <INDILightPropertyContainer  key={propertyId} propertyId={propertyId} /> );
            default:
                // TODO: render blob in some way?
                return ( <span key={propertyId}>Unsupported {type} property {label} ({name})</span> );
        }
    }


    render = () => (
        <Grid.Row>
            <Grid.Column verticalAlign="middle" width={2}><INDILight state={this.props.property.state} /></Grid.Column>
            <Grid.Column verticalAlign="middle" width={2}><Label content={this.props.property.label} /></Grid.Column>
            <Grid.Column verticalAlign="middle" width={12}>
                {this.renderPropertyContiner()}
            </Grid.Column>
        </Grid.Row>
    );
}


