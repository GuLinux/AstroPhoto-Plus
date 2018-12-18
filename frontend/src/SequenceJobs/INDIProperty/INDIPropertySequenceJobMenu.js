import React from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { INDIPropertySequenceJobGroupItemContainer, INDIPropertySequenceJobPropertyItemContainer } from './INDIPropertySequenceJobMenuItem';



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
/*
    getValuesForm() {
        if( this.state.sequenceJob.property === '')
            return null;
        let property = this.getProperties()[this.state.sequenceJob.property];
        let onChange = (values) => this.setState({...this.state, sequenceJob: {...this.state.sequenceJob, values: {...this.state.sequenceJob.values, ...values} } });
        return property.values.map( (value, index) => {
            let props = { key: index, value, property, onChange, editMode: true }
            switch(property.type) {
                case 'switch':
                    return <INDISwitch {...props} />;
                case 'number':
                    return <INDINumber {...props} />
                case 'text':
                    return <INDIText {...props} />
                default:
                    return null
            }
        })
    }
*/
