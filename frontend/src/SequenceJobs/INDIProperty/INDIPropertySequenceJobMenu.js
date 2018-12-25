import React from 'react';
import { Menu } from 'semantic-ui-react';
import { INDIPropertySequenceJobGroupItemContainer, INDIPropertySequenceJobPropertyItemContainer } from './INDIPropertySequenceJobMenuItem';
import { INDISwitchContainer, INDITextContainer, INDINumberContainer } from '../../INDI-Server/INDIValueContainer';
import { get } from 'lodash';
import { getValueName, switchValues } from '../../INDI-Server/utils';



export class INDIPropertySequenceJobDeviceMenu extends React.PureComponent {
    render = () => this.props.device ? (
        <Menu pointing size='mini' vertical>
            <Menu.Item header>Group</Menu.Item>
            {this.props.device.groups.map(this.renderGroup)}
        </Menu>
    ) : null;

    renderGroup = (group) => <INDIPropertySequenceJobGroupItemContainer
        groupId={group}
        key={group}
        active={this.props.groupId === group}
        onSelected={this.props.onGroupSelected} />;

}

export class INDIPropertySequenceJobGroupMenu extends React.PureComponent {
    render = () => this.props.group ? (
        <Menu pointing size='mini' vertical>
            <Menu.Item header>Property</Menu.Item>
            {this.props.group.properties.map(this.renderProperty)}
        </Menu>
    ) : null;

    renderProperty = property => <INDIPropertySequenceJobPropertyItemContainer
        propertyId={property}
        key={property}
        active={this.props.propertyId === property}
        onSelected={this.props.onPropertySelected}
    />
}


export class INDIPropertySequenceJobValues extends React.PureComponent {
    onValueChanged = (value) => {
        if(this.props.property.type === 'switch') {
            value = switchValues(value, this.props.property);
        }
        this.props.onValueChanged(value);
    }

    onMount = (value) => this.props.onValueChanged({
        [value.name]: value.value,
    });

    renderValue = valueId => {
        const props = {
            key: valueId,
            valueId,
            editMode: true,
            onChange: this.onValueChanged,
            displayValue: get(this.props, ['values', getValueName(valueId)]),
            property: this.props.property
        };
        switch(this.props.property.type) {
            case 'switch':
                return <INDISwitchContainer onMount={this.onMount} {...props} />;
            case 'text':
                return <INDITextContainer onMount={this.onMount} {...props} />;
            case 'number':
                return <INDINumberContainer onMount={this.onMount} {...props} />;
            default:
                return null;
        }
    }
    render = () => this.props.property ?(
        <React.Fragment>
            {this.props.property.values.map(this.renderValue)}
        </React.Fragment>
    ) : null;
}
