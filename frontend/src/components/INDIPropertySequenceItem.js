import React from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import SequenceItemButtonsContainer from '../containers/SequenceItemButtonsContainer'

import INDIText from './INDIText';
import INDINumber from './INDINumber';
import INDISwitch from './INDISwitch';

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
            let props = { key: index, value, property, displayValue: displayValues[value.name], isWriteable: true, addPendingValues, hideCurrent: true }
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
                { this.getValuesForm() }
                <SequenceItemButtonsContainer isValid={this.isValid()} isChanged={this.isChanged()} sequenceItem={this.state.sequenceItem} />
            </form>
        )
    }
}

export default INDIPropertySequenceItem
