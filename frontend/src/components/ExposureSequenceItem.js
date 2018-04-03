import React from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

class ExposureSequenceItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sequenceItem: {shots: '', exposure: '', globalExposure: '', ...props.sequenceItem},
            shootingParamsChangesSequence: ['shots', 'exposure'],
        }
    }

    buildSequenceItemState(options) {
        return {...this.state, sequenceItem: {...this.state.sequenceItem, ...options}};
    }

    onNameChanged(name) {
        this.setState(this.buildSequenceItemState({name}))
    }

    onShotsChanged(shots) {
        this.updateShootingParams('shots', shots)
    }

    onExposureChanged(exposure) {
        this.updateShootingParams('exposure', exposure)
    }
    
    onGlobalExposureChanged(globalExposure) {
        this.updateShootingParams('globalExposure', globalExposure)
    }

    updateShootingParams(key, value) {
        let newState = this.buildSequenceItemState({[key]: value});
        let shootingParamsChangesSequence = [key, ...this.state.shootingParamsChangesSequence];
        shootingParamsChangesSequence = shootingParamsChangesSequence.filter( (key, index) => index == shootingParamsChangesSequence.indexOf(key) && newState.sequenceItem[key] > 0);
        if(shootingParamsChangesSequence.length > 1) {
            let changedParams = shootingParamsChangesSequence.slice(0, 2);
            if(changedParams.includes('shots') && changedParams.includes('exposure'))
                newState.sequenceItem.globalExposure = newState.sequenceItem.shots * newState.sequenceItem.exposure;
            if(changedParams.includes('globalExposure') && changedParams.includes('exposure'))
                newState.sequenceItem.shots= newState.sequenceItem.globalExposure / newState.sequenceItem.exposure;
            if(changedParams.includes('shots') && changedParams.includes('globalExposure'))
                newState.sequenceItem.exposure = newState.sequenceItem.globalExposure / newState.sequenceItem.shots;
        }
        this.setState({...newState, shootingParamsChangesSequence});
    }

    render() {
        return (
            <form>
                <FormGroup controlId="name">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl type="text" value={this.state.sequenceItem.name} onChange={ e => this.onNameChanged(e.target.value) } />
                    <HelpBlock>This will be used as a template for file names</HelpBlock>
                </FormGroup>
                <FormGroup controlId="shots-num">
                    <ControlLabel>Shots</ControlLabel>
                    <FormControl type="number" value={this.state.sequenceItem.shots} min={1} step={1} onChange={e => this.onShotsChanged(e.target.value)} />
                    <HelpBlock>Number of shots in this sequence item</HelpBlock>
                </FormGroup>
                <FormGroup controlId="exposure">
                    <ControlLabel>Exposure</ControlLabel>
                    <FormControl type="number" value={this.state.sequenceItem.exposure} min={0} onChange={e => this.onExposureChanged(e.target.value)} />
                    <HelpBlock>Exposure for each shot in seconds</HelpBlock>
                </FormGroup>
                <FormGroup controlId="total-exposure">
                    <ControlLabel>Total Exposure</ControlLabel>
                    <FormControl type="number" value={this.state.sequenceItem.globalExposure} min={0} onChange={e => this.onGlobalExposureChanged(e.target.value)} />
                    <HelpBlock>Total exposure time for this sequence</HelpBlock>
                </FormGroup>
            </form>
        );
    }
}

export default ExposureSequenceItem;
