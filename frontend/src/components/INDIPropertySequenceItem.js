import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import SequenceItemButtonsContainer from '../containers/SequenceItemButtonsContainer'

class INDIPropertySequenceItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = { group: '', sequenceItem: {device: '', property: '', ...props.sequenceItem }} 
    }

    isValid() {
        return this.state.sequenceItem.device !== '' && this.state.sequenceItem.property !== '';
    }

    isChanged() {
        return this.state.sequenceItem.device !== this.props.sequenceItem.device && this.state.sequenceItem.property !== this.props.sequenceItem.property;
    }

    onDeviceChanged(device) {
        this.setState({...this.state, group: '', sequenceItem: {...this.state.sequenceItem, device, property: ''} })
    }

    onGroupChanged(group) {
        this.setState({...this.state, group, sequenceItem: {...this.state.sequenceItem, property: ''} });
    }

    onPropertyChanged(property) {
        this.setState({...this.state, sequenceItem: {...this.state.sequenceItem, property } });
    }

    getDevice() {
        return this.props.devices.find(d => d.name === this.state.sequenceItem.device );
    }

    getProperties() {
        return this.props.propertiesMap[this.getDevice().id]
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
            <FormGroup controlId="group">
                <ControlLabel>group</ControlLabel>
                <FormControl componentClass="select" value={this.state.group} onChange={ e => this.onGroupChanged(e.target.value) }>
                    <option value="">--- select group</option>
                    { groups.map(g => (
                        <option value={g} key={g}>{g}</option>
                    ))}
                </FormControl>
            </FormGroup>
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
            <FormGroup controlId="property">
                <ControlLabel>property</ControlLabel>
                <FormControl componentClass="select" value={this.state.sequenceItem.property} onChange={ e => this.onPropertyChanged(e.target.value) }>
                    <option value="">--- select property</option>
                    { properties.map(p => (
                        <option value={p.name} key={p.id}>{p.label}</option>
                    ))}
                </FormControl>
            </FormGroup>
        )
    }



    render() {
        return (
            <form className="container">
                <FormGroup controlId="device">
                    <ControlLabel>Device</ControlLabel>
                    <FormControl componentClass="select" value={this.state.sequenceItem.device} onChange={ e => this.onDeviceChanged(e.target.value) }>
                        <option value="">--- select device</option>
                        { this.props.devices.map(d => (
                            <option value={d.name} key={d.id}>{d.name}</option>
                        ))}
                    </FormControl>
                </FormGroup>
                { this.getGroupsForm() }
                { this.getPropertiesForm() }
                <SequenceItemButtonsContainer isValid={this.isValid()} isChanged={this.isChanged()} sequenceItem={this.state.sequenceItem} />
            </form>
        )
    }
}

export default INDIPropertySequenceItem
