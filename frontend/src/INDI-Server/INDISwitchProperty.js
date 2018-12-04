import React from 'react';
import { INDISwitch } from './INDISwitch'


export class INDISwitchProperty extends React.PureComponent {

    setPropertyValues = v => this.props.setPropertyValues(this.props.device, this.props.property, v);

    render = () => {
        const {device, property, isWriteable} = this.props;
        return (
            <span>
                {property.values.map( (value, index) =>
                    <INDISwitch
                        key={index}
                        property={property}
                        value={value}
                        editMode={isWriteable}
                        onChange={this.setPropertyValues}
                    /> )}
            </span>
        );
    }
}

