import React from 'react';
import { Menu, Divider, Container, Grid, Form } from 'semantic-ui-react'
import SequenceJobButtonsContainer from './SequenceJobButtonsContainer'

import INDIText from '../INDI-Server/INDIText';
import INDINumber from '../INDI-Server/INDINumber';
import INDISwitch from '../INDI-Server/INDISwitch';

class INDIPropertySequenceJob extends React.Component {
    constructor(props) {
        super(props)
        this.state = { group: '', sequenceJob: {device: '', property: '', wait: -1, ...props.sequenceJob }}

        if(props.sequenceJob.device && props.sequenceJob.property) {
            this.state.group = this.getProperties()[props.sequenceJob.property].group
        }
    }

    isValid() {
        return this.state.sequenceJob.device !== '' && this.state.sequenceJob.property !== '' && Object.keys(this.state.sequenceJob.values).length !== 0;
    }

    isChanged() {
        //this.state.sequenceJob.device !== this.props.sequenceJob.device && this.state.sequenceJob.property !== this.props.sequenceJob.property;
        return true;
    }

    onDeviceChanged(device) {
        this.setState({...this.state, group: '', sequenceJob: {...this.state.sequenceJob, device, property: ''} })
    }

    onGroupChanged(group) {
        this.setState({...this.state, group, sequenceJob: {...this.state.sequenceJob, property: ''} });
    }

    onPropertyChanged(property) {
        let values = this.getProperties()[property].values.reduce( (values, value) => ({...values, [value.name]: value.value}), {} )
        this.setState({...this.state, sequenceJob: {...this.state.sequenceJob, property, values  } });
    }

    getDevice() {
        return this.props.devices.find(d => d.name === this.state.sequenceJob.device );
    }

    getProperties() {
        return this.props.propertiesMap[this.getDevice().id]
    }

    getValuesForm() {
        if( this.state.sequenceJob.property === '')
            return null;
        let property = this.getProperties()[this.state.sequenceJob.property];
        let displayValues = this.state.sequenceJob.values
        let addPendingValues = (values) => this.setState({...this.state, sequenceJob: {...this.state.sequenceJob, values: {...this.state.sequenceJob.values, ...values} } });
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
        if(this.state.sequenceJob.device === '')
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
                        active={this.state.sequenceJob.property === p.name}
                        key={p.id}
                        onClick={() => this.onPropertyChanged(p.name)}
                    >
                        {p.label}
                    </Menu.Item>
                ))}
            </Menu>
        )
    }

    onWaitChanged = (checked) => this.setState({...this.state, sequenceJob: {...this.state.sequenceJob, wait: checked ? -1 : 0} });

    render() {
        return (
            <Container>
                <Menu stackable pointing>
                    <Menu.Item header>Device</Menu.Item>
                    { this.props.devices.map(d => (
                        <Menu.Item
                            active={this.state.sequenceJob.device === d.name}
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
                <Form>
                    <Form.Checkbox label='Wait until value is set' checked={this.state.sequenceJob.wait !== 0} onChange={(e, data) => this.onWaitChanged(data.checked)}/>
                </Form>
                <Divider section />
                <SequenceJobButtonsContainer isValid={this.isValid()} isChanged={this.isChanged()} sequenceJob={this.state.sequenceJob} />

            </Container>
        )
    }
}

export default INDIPropertySequenceJob
