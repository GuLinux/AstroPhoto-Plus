import React from 'react';
import { Form, Header, Input, Button } from 'semantic-ui-react';
import { get, isEqual } from 'lodash';
import { set } from 'lodash/fp'
import { NumericInput } from '../../components/NumericInput';
import { SequenceJobButtonsContainer } from '../SequenceJobButtonsContainer';

export class PauseSequenceJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = { sequenceJob: props.sequenceJob };
    }

    autoresume = () => get(this.state, 'sequenceJob.autoresume', 0);

    componentDidUpdate = (prevProps, prevState) => {
        const prevAutoresume = get(prevState, 'sequenceJob.autoresume');
        if(
            this.autoresume() !== prevAutoresume &&
            (!this.autoresume() || ! prevAutoresume) &&
            this.sequenceJob().notificationMessage === this.defaultNotificationMessage(prevAutoresume)
            ) {
            this.resetNotificationMessage();
        }
    }
   
    defaultNotificationMessage = (autoresume) => {
        if(autoresume === undefined) {
            autoresume = this.autoresume();
        }
        return autoresume > 0 ?
            `The sequence will restart in ${autoresume} seconds. You can also resume the sequence by pressing the Resume button` :
            'You can resume the sequence by pressing the Resume button';
    }

    setField = (field, value) => this.setState(set(['sequenceJob', field], value, this.state));
    sequenceJob = () => ({
        ...this.props.sequenceJob,
        autoresume: this.autoresume(),
        showNotification: get(this.state, 'sequenceJob.showNotification', true),
        notificationMessage: get(this.state, 'sequenceJob.notificationMessage', this.defaultNotificationMessage()),
    })

    toggleAutoResume = () => this.setField('autoresume', this.sequenceJob().autoresume > 0 ? 0 : 10);
    onAutoresumeChanged = (value) => this.setField('autoresume', value);
    toggleShowNotification = () => this.setField('showNotification', !this.sequenceJob().showNotification);
    setNotificationMessage = (e, {value}) => this.setField('notificationMessage', value);
    resetNotificationMessage = () => this.setField('notificationMessage', undefined);

    isChanged = () => !isEqual(this.sequenceJob(), this.props.sequenceJob);

    render = () => (
        <Form>
            <Header size='small' content='Pause sequence' />
            <Form.Checkbox toggle label='Automatically resume' checked={this.sequenceJob().autoresume > 0} onChange={this.toggleAutoResume}/>
            {
                this.sequenceJob().autoresume > 0 && (
                    <Form.Field>
                        <label>after</label> 
                        <NumericInput
                            value={this.sequenceJob().autoresume}
                            label='seconds'
                            labelPosition='right'
                            min={1}
                            step={1}
                            onChange={this.onAutoresumeChanged}
                        />
                    </Form.Field>
                )
            }
            <Form.Checkbox toggle label='Show notification' checked={this.sequenceJob().showNotification} onChange={this.toggleShowNotification} />
            {
                this.sequenceJob().showNotification &&
                    <Form.Field>
                        <label>Notification message</label>
                        <Input
                            label={
                                <Button
                                    content='reset'
                                    onClick={this.resetNotificationMessage}
                                    disabled={this.defaultNotificationMessage() === this.sequenceJob().notificationMessage}
                                />
                            }
                            type='text'
                            value={this.sequenceJob().notificationMessage}
                            onChange={this.setNotificationMessage}
                            labelPosition='right'
                        />
                    </Form.Field>
            }
            <SequenceJobButtonsContainer isValid isChanged={this.isChanged()} sequenceJob={this.sequenceJob()} />
        </Form>
    );
}