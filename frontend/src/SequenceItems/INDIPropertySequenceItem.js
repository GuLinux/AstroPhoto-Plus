import React from 'react';
import { Menu, Divider, Container, Grid } from 'semantic-ui-react'
import SequenceItemButtonsContainer from './SequenceItemButtonsContainer'

import INDIText from '../INDI-Server/INDIText';
import INDINumber from '../INDI-Server/INDINumber';
import INDISwitch from '../INDI-Server/INDISwitch';

class INDIPropertySequenceItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = { group: '', sequenceItem: {device: '', property: '', ...props.sequenceItem }}

        if(props.sequenceItem.device && props.sequenceItem.property) {
            this.state.group = this.getProperties()[props.sequenceItem.property].group
        }
    }

    isValid() {
        return this.state.sequenceItem.device !== '' && this.state.sequenceItem.property !== '' && Object.keys(this.state.sequenceItem.values).length !== 0;
    }

    isChanged() {
        //this.state.sequenceItem.device !== this.props.sequenceItem.device && this.state.sequenceItem.property !== this.props.sequenceItem.property;
        return true;
    }

    onDeviceChanged(device) {
        this.setState({...this.state, group: '', sequenceItem: {...this.state.sequenceItem, device, property: ''} })
    }

    onGroupChanged(group) {
        this.setState({...this.state, group, sequenceItem: {...this.state.sequenceItem, property: ''} });
    }

    onPropertyChanged(property) {
        let values = this.getProperties()[property].values.reduce( (values, value) => ({...values, [value.name]: value.value}), {} )
        this.setState({...this.state, sequenceItem: {...this.state.sequenceItem, property, values  } });
    }

    getDevice() {
        return this.props.devices.find(d => d.name === this.state.sequenceItem.device );
    }

    getProperties() {
        return this.props.propertiesMap[this.getDevice().id]
    }

    getValuesForm() {
        if( this.state.sequenceItem.property === '')
            return null;
        let property = this.getProperties()[this.state.sequenceItem.property];
        let displayValues = this.state.sequenceItem.values
        let addPendingValues = (values) => this.setState({...this.state, sequenceItem: {...this.state.sequenceItem, values: {...this.state.sequenceItem.values, ...values} } });
        return property.values.map( (value, index) => {
            let props = { key: index, value, property, displayValue: displayValues[value.name], addPendingValues, editMode: true }
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

    getGroups() {
        if(this.state.sequenceItem.device === '')
            return [];
        let properties = this.getProperties();
        let groups = Object.keys(properties).map(name => properties[name].group);
        return groups.filter( (group, index) => groups.indexOf(group) === index);
    }

    getGroupsForm() {
        let groups = this.getGroups();
        if(groups.length === 0)
            return null;
        return (
            <Menu pointing size='mini' vertical>
                <Menu.Item header>Group</Menu.Item>
                { groups.map(g => (
                        <Menu.Item
                            active={this.state.group === g}
                            key={g}
                            onClick={() => this.onGroupChanged(g)}
                        >
                        {g}
                        </Menu.Item>
                ))}
            </Menu>
        )
    }

    getGroupProperties() {
        if(this.state.group === '')
            return [];
        let properties = this.getProperties();
        let groupProperties = Object.keys(properties).map(p => properties[p]).filter(p => p.group === this.state.group)
        return groupProperties;
    }


    getPropertiesForm() {
        let properties = this.getGroupProperties();
        if(properties.length === 0)
            return null;
        return (
            <Menu size='mini' pointing vertical>
                <Menu.Item header>Property</Menu.Item>
                { properties.map(p => (
                    <Menu.Item
                        active={this.state.sequenceItem.property === p.name}
                        key={p.id}
                        onClick={() => this.onPropertyChanged(p.name)}
                    >
                        {p.label}
                    </Menu.Item>
                ))}
            </Menu>
        )
    }



    render() {
        return (
            <Container>
                <Menu stackable pointing>
                    <Menu.Item header>Device</Menu.Item>
                    { this.props.devices.map(d => (
                        <Menu.Item
                            active={this.state.sequenceItem.device === d.name}
                            key={d.id}
                            onClick={() => this.onDeviceChanged(d.name)}
                        >
                            {d.name}
                        </Menu.Item>
                    ) ) }
                </Menu>
                <Grid stackable>
                    <Grid.Column width={2}>
                        { this.getGroupsForm() }
                    </Grid.Column>
                    <Grid.Column width={2}>
                        { this.getPropertiesForm() }
                    </Grid.Column>
                    <Grid.Column width={12}>
                        { this.getValuesForm() }
                    </Grid.Column>
                </Grid>
                <Divider section />
                <SequenceItemButtonsContainer isValid={this.isValid()} isChanged={this.isChanged()} sequenceItem={this.state.sequenceItem} />
            </Container>
        )
    }
}

export default INDIPropertySequenceItem
