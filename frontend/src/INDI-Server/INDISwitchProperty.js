import React from 'react';
import { INDISwitchContainer } from './INDIValueContainer';

export class INDISwitchProperty extends React.PureComponent {

    setPropertyValues = v => this.props.setPropertyValues(this.props.device, this.props.property, v);

    renderSwitch = (value, index) => (
        <INDISwitchContainer
            key={index}
            property={this.props.property}
            valueId={value}
            editMode={this.props.isWriteable}
            onChange={this.setPropertyValues}
        />
    );

    render = () => (
        <span>
            {this.props.property.values.map(this.renderSwitch)}
        </span>
    );
}

