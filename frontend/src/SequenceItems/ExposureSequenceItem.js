import React from 'react';
import { Form, Label, Input, Divider } from 'semantic-ui-react';
import { sanitizePath, secs2time } from '../utils'
import SequenceItemButtonsContainer from './SequenceItemButtonsContainer'

class ExposureSequenceItem extends React.Component {
    constructor(props) {
        super(props)
        this.initialSequenceItem =
        this.state = {
            sequenceItem: this.initialValues(),
            shootingParamsChangesSequence: ['count', 'exposure'],
            validation: {}
        }
    }

    initialValues() {
        let values = {filename: '{filter}-{exposure}-{number:04}.fits', directory: '', count: '', exposure: '', globalExposure: '', ...this.props.sequenceItem}
        if(values.exposure && values.count)
            values.globalExposure = values.exposure * values.count;
        return values;
    }

    isChanged() {
        return ['filename', 'directory', 'count', 'exposure', 'globalExposure']
            .map(f => this.state.sequenceItem[f] !== this.initialValues()[f])
            .reduce( (isChanged, current) => isChanged || current, false)
    }

    buildSequenceItemState(options) {
        return {...this.state, sequenceItem: {...this.state.sequenceItem, ...options}};
    }

    onFilenameChanged(filename) {
        this.validate(this.buildSequenceItemState({filename: sanitizePath(filename)}))
    }

    onDirectoryChanged(directory) {
        this.validate(this.buildSequenceItemState({directory: sanitizePath(directory) }))
    }

    onCountChanged(count) {
        if(isNaN(count))
            return
        this.updateShootingParams('count', parseInt(count, 10))
    }

    onExposureChanged(exposure) {
        if(isNaN(exposure))
            return
        this.updateShootingParams('exposure', parseFloat(exposure))
    }

    onGlobalExposureChanged(globalExposure) {
        if(isNaN(globalExposure))
            return
        this.updateShootingParams('globalExposure', parseFloat(globalExposure))
    }

    updateShootingParams(key, value) {
        let newState = this.buildSequenceItemState({[key]: value});
        let shootingParamsChangesSequence = [key, ...this.state.shootingParamsChangesSequence];
        shootingParamsChangesSequence = shootingParamsChangesSequence.filter( (key, index) => index === shootingParamsChangesSequence.indexOf(key) && newState.sequenceItem[key] > 0);
        if(shootingParamsChangesSequence.length > 1) {
            let changedParams = shootingParamsChangesSequence.slice(0, 2);
            if(changedParams.includes('count') && changedParams.includes('exposure'))
                newState.sequenceItem.globalExposure = newState.sequenceItem.count * newState.sequenceItem.exposure;
            if(changedParams.includes('globalExposure') && changedParams.includes('exposure'))
                newState.sequenceItem.count= newState.sequenceItem.globalExposure / newState.sequenceItem.exposure;
            if(changedParams.includes('count') && changedParams.includes('globalExposure'))
                newState.sequenceItem.exposure = newState.sequenceItem.globalExposure / newState.sequenceItem.count;
        }
        this.validate({...newState, shootingParamsChangesSequence});
    }

    validate(state) {
        let validation = {
            filename: !! state.sequenceItem.filename,
            directory: !! state.sequenceItem.directory,
            exposure: !! state.sequenceItem.count && !! state.sequenceItem.exposure && !! state.sequenceItem.globalExposure,
        }
        state = {...state, validation}
        this.setState(state)
        return state;
    }

    isValid() {
        return this.state.validation.filename &&
                this.state.validation.exposure
    }

    renderTime(time) {
        if(!time || time === '')
            return ''
        return secs2time(time);
    }

    render() {
        return (
            <Form>
                <Form.Input
                    type='text'
                    value={this.state.sequenceItem.filename}
                    onChange={e => this.onFilenameChanged(e.target.value)}
                    placeholder='filename'
                    label='Filename' />
                <Label size='tiny'>
                Filename template for each shot. This will be formatted using <a rel="noopener noreferrer" href="https://docs.python.org/3.4/library/string.html#format-specification-mini-language" target="_BLANK">python string formatting rules</a>, you can use the following keywords:
                    <ul>
                        <li>exposure</li>
                        <li>number</li>
                        <li>timestamp</li>
                        <li>datetime</li>
                        <li>filter</li>
                        <li>filter_index</li>
                    </ul>
                    Example: luminance_{'{exposure}_{number:04}.fits'}
                </Label>
                <Divider hidden />

                <Form.Input
                    type='text'
                    label='Directory'
                    placeholder='directory'
                    value={this.state.sequenceItem.directory}
                    onChange={ e => this.onDirectoryChanged(e.target.value)}
                />
                <Label size='tiny'>Directory for this sequence</Label>
                <Divider hidden />

                <Form.Input
                    type='number'
                    label='Count'
                    placeholder='count'
                    value={this.state.sequenceItem.count}
                    min={1}
                    step={1}
                    onChange={e => this.onCountChanged(e.target.value)}
                />
                <Label size='tiny'>Number of shots in this sequence item</Label>
                <Divider hidden />


                <Form.Field>
                    <label>Exposure</label>
                    <Input
                        type='number'
                        label={{basic: true, content: this.renderTime(this.state.sequenceItem.exposure)}}
                        placeholder='exposure'
                        value={this.state.sequenceItem.exposure}
                        min={0}
                        onChange={e => this.onExposureChanged(e.target.value)}
                    />
                </Form.Field>
                <Label size='tiny'>Exposure for each shot in seconds</Label>
                <Divider hidden />


                <Form.Field>
                    <label>Total Exposure</label>
                    <Input
                        type='number'
                        label={{basic: true, content: this.renderTime(this.state.sequenceItem.globalExposure)}}
                        placeholder='exposure'
                        value={this.state.sequenceItem.globalExposure}
                        min={0}
                        onChange={e => this.onGlobalExposureChanged(e.target.value)}
                    />
                </Form.Field>
                <Label size='tiny'>Total exposure time for this sequence</Label>

                <Divider />
                <SequenceItemButtonsContainer isValid={this.isValid()} isChanged={this.isChanged()} sequenceItem={this.state.sequenceItem} />
            </Form>
        );
    }
}

export default ExposureSequenceItem;
