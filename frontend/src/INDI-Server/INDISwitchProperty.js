import React from 'react';
import { INDISwitchContainer } from './INDIValueContainer';
import { switchValues } from './utils';

export class INDISwitchProperty extends React.PureComponent {

    setPropertyValues = value => {
        value = switchValues(value, this.props.property);
        this.props.setPropertyValues(this.props.device, this.props.property, value);
    }

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

