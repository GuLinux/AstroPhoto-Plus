import React from 'react';
import { INDISwitch } from './INDISwitch'


export class INDISwitchProperty extends React.PureComponent {

    setPropertyValues = v => this.props.setPropertyValues(this.props.device, this.props.property, v);

    renderSwitch = (value, index) => (
        <INDISwitch
            key={index}
            property={this.props.property}
            value={value}
            editMode={this.props.isWriteable}
            onChange={this.setPropertyValues}
        />
    );

    render = () => {
        const {device, property, isWriteable} = this.props;
        return (
            <span>
                {this.props.property.values.map(this.renderSwitch)}
            </span>
        );
    }
}

