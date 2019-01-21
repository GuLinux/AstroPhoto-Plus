import React from 'react';
import { Form, Label, Divider, Accordion } from 'semantic-ui-react';
import { sanitizePath, secs2time } from '../../utils'
import { SequenceJobButtonsContainer } from '../SequenceJobButtonsContainer'
import { formatDecimalNumber } from '../../utils';
import { NumericInput } from '../../components/NumericInput';
import { NotFoundPage } from '../../components/NotFoundPage';
import { get } from 'lodash';

export class ExposureSequenceJob extends React.Component {
    constructor(props) {
        super(props)
        this.initialSequenceJob =
        this.state = {
            sequenceJob: this.initialValues(),
            shootingParamsChangesSequence: ['count', 'exposure'],
            validation: {}
        }
    }

    initialValues() {
        let values = {
            filename: '{exposure}-{number:04}.fits',
            directory: '',
            count: '',
            exposure: '',
            globalExposure: '',
            shots_pause: 0,
            shots_group: 1,
            shots_group_pause: 0,
            ...this.props.sequenceJob
        };
        if(this.props.hasFilterWheel) {
            values.filename = '{filter}-' + values.filename;
        }
        if(values.exposure && values.count)
            values.globalExposure = values.exposure * values.count;
        return values;
    }

    isChanged() {
        return ['filename', 'directory', 'count', 'exposure', 'globalExposure', 'shots_pause', 'shots_group', 'shots_group_pause']
            .map(f => this.state.sequenceJob[f] !== this.initialValues()[f])
            .reduce( (isChanged, current) => isChanged || current, false)
    }

    buildSequenceJobState(options) {
        return {...this.state, sequenceJob: {...this.state.sequenceJob, ...options}};
    }

    onFilenameChanged(filename) {
        this.validate(this.buildSequenceJobState({filename: sanitizePath(filename)}))
    }

    onDirectoryChanged(directory) {
        this.validate(this.buildSequenceJobState({directory: sanitizePath(directory) }))
    }

    onCountChanged(count) {
        if(isNaN(count))
            return
        this.updateShootingParams('count', parseInt(count, 10))
    }

    onShotsPauseChanged(seconds) {
        if(isNaN(seconds))
            return
        this.updateShootingParams('shots_pause', parseInt(seconds, 10))
    }


    onShotsGroupPauseChanged(seconds) {
        if(isNaN(seconds))
            return
        this.updateShootingParams('shots_group_pause', parseInt(seconds, 10))
    }


    onShotsGroupChanged(shots) {
        if(isNaN(shots))
            return
        this.updateShootingParams('shots_group', parseInt(shots, 10))
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
        const { exposureValue } = this.props;
        const { min, max } = exposureValue;

        let newState = this.buildSequenceJobState({[key]: value});
        let shootingParamsChangesSequence = [key, ...this.state.shootingParamsChangesSequence];
        shootingParamsChangesSequence = shootingParamsChangesSequence.filter( (key, index) => index === shootingParamsChangesSequence.indexOf(key) && newState.sequenceJob[key] > 0);
        if(shootingParamsChangesSequence.length > 1) {
            let changedParams = shootingParamsChangesSequence.slice(0, 2);
            if(changedParams.includes('count') && changedParams.includes('exposure'))
                newState.sequenceJob.globalExposure = newState.sequenceJob.count * newState.sequenceJob.exposure;
            if(changedParams.includes('globalExposure') && changedParams.includes('exposure')) {
                newState.sequenceJob.count= newState.sequenceJob.globalExposure / newState.sequenceJob.exposure;
            }
            if(changedParams.includes('count') && changedParams.includes('globalExposure'))
                newState.sequenceJob.exposure = newState.sequenceJob.globalExposure / newState.sequenceJob.count;
        }
        newState.sequenceJob.count = Math.max(1, parseInt(newState.sequenceJob.count, 10));
        newState.sequenceJob.exposure = Math.min(max, newState.sequenceJob.exposure);
        newState.sequenceJob.exposure = Math.max(min, newState.sequenceJob.exposure);
        newState.sequenceJob.globalExposure = newState.sequenceJob.count * newState.sequenceJob.exposure;
        this.validate({...newState, shootingParamsChangesSequence});
    }

    validate(state) {
        let validation = {
            filename: !! state.sequenceJob.filename,
            directory: !! state.sequenceJob.directory,
            exposure: !! state.sequenceJob.count && !! state.sequenceJob.exposure && !! state.sequenceJob.globalExposure,
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

    toggleTimeLapse = () => this.setState({...this.state, activeAccordion: this.timeLapseActive() ? 0 : 1});

    timeLapseActive = () =>
        get(this.state, 'activeAccordion', 0) === 1 ||
        get(this.state, 'sequenceJob.shots_pause', 0) > 0 ||
        get(this.state, 'sequenceJob.shots_group', 1) > 1;

    render = () => {
        const { exposureValue } = this.props;
        return exposureValue ? (
            <Form>
                <Form.Input
                    type='text'
                    value={this.state.sequenceJob.filename}
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
                    value={this.state.sequenceJob.directory}
                    onChange={ e => this.onDirectoryChanged(e.target.value)}
                />
                <Label size='tiny'>Directory for this sequence</Label>
                <Divider hidden />

                <Form.Field>
                    <label>Count</label>
                    <NumericInput
                        placeholder='count'
                        value={this.state.sequenceJob.count}
                        min={1}
                        step={1}
                        parse={v => v === '' ? '' : parseInt(v, 10)}
                        format={v => v.toString()}
                        onChange={v => this.onCountChanged(v)}
                />
                </Form.Field>
                <Label size='tiny'>Number of shots in this sequence item</Label>
                <Divider hidden />


                <Form.Field>
                    <label>Exposure</label>
                    <NumericInput
                        label={{basic: true, content: this.renderTime(this.state.sequenceJob.exposure)}}
                        placeholder='exposure'
                        value={this.state.sequenceJob.exposure}
                        min={exposureValue.min}
                        max={exposureValue.max}
                        step={exposureValue.step}
                        format={v => v === '' ? '' : formatDecimalNumber(exposureValue.format, v)}
                        parse={v => parseFloat(v)}
                        onChange={v => this.onExposureChanged(v)}
                    />
                </Form.Field>
                <Label size='tiny'>Exposure for each shot in seconds</Label>
                <Divider hidden />



                <Form.Field>
                    <label>Total Exposure</label>
                    <NumericInput
                        min={exposureValue.min}
                        step={exposureValue.step}
                        format={v => v === '' ? '' : formatDecimalNumber(exposureValue.format, v)}
                        parse={v => parseFloat(v)}
                        label={{basic: true, content: this.renderTime(this.state.sequenceJob.globalExposure)}}
                        placeholder='exposure'
                        value={this.state.sequenceJob.globalExposure}
                        onChange={v => this.onGlobalExposureChanged(v)}
                    />
                </Form.Field>
                <Label size='tiny'>Total exposure time for this sequence</Label>

                <Divider hidden />

                <Accordion>
                    <Accordion.Title active={this.timeLapseActive()} onClick={this.toggleTimeLapse} index={1} content='Time lapse and groups options'/>
                    <Accordion.Content active={this.timeLapseActive()}>
                        <Form.Field>
                            <label>Pause between shots</label>
                            <NumericInput
                                label={{basic: true, content: this.renderTime(this.state.sequenceJob.shots_pause)}}
                                placeholder='seconds'
                                value={this.state.sequenceJob.shots_pause}
                                min={0}
                                max={99999}
                                step={1}
                                parse={v => v === '' ? '' : parseInt(v, 10)}
                                format={v => v.toString()}
                                onChange={v => this.onShotsPauseChanged(v)}
                            />
                        </Form.Field>
                        <Label size='tiny'>Pause between each shot (useful for timelapses, use 0 otherwise)</Label>
                        <Divider hidden />

                        <Form.Field>
                            <label>Group shots</label>
                            <NumericInput
                                placeholder='shots per group'
                                value={this.state.sequenceJob.shots_group}
                                min={1}
                                max={this.state.sequenceJob.count}
                                step={1}
                                parse={v => v === '' ? '' : parseInt(v, 10)}
                                format={v => v.toString()}
                                onChange={v => this.onShotsGroupChanged(v)}
                            />
                        </Form.Field>
                        <Label size='tiny'>Instead of shooting regularly, group shots. This means that, if you set "Group shots" to 5, "Pause between shots" to 2, and "Pause between groups" to 10, this will be the sequence of shots:
                            <ul>
                                <li>5 shots, with 2 seconds pause between each shot</li>
                                <li>pause for 10 seconds</li>
                                <li>another 5 shots, with 2 seconds pause between each shot</li>
                            </ul>
                            until "Count" shots will be taken.
                        </Label>
                        <Divider hidden />

                        <Form.Field>
                            <label>Pause between groups</label>
                            <NumericInput
                                placeholder='seconds'
                                value={this.state.sequenceJob.shots_group_pause}
                                disabled={this.state.sequenceJob.shots_group < 2}
                                label={{basic: true, content: this.renderTime(this.state.sequenceJob.shots_group_pause)}}
                                min={0}
                                max={99999}
                                step={1}
                                parse={v => v === '' ? '' : parseInt(v, 10)}
                                format={v => v.toString()}
                                onChange={v => this.onShotsGroupPauseChanged(v)}
                            />
                        </Form.Field>
                        <Label size='tiny'>Pause between each group. See previous field for an example.</Label>
                        <Divider hidden />

                    </Accordion.Content>
                </Accordion>

                <Divider section />
                <SequenceJobButtonsContainer isValid={this.isValid()} isChanged={this.isChanged()} sequenceJob={this.state.sequenceJob} />
            </Form>
        ) : <NotFoundPage />;
    }
}

