import React from 'react';
import { Form, Container, Button, Message, Icon, Divider, Segment, Header} from 'semantic-ui-react';

const valueOrDefault = (value, defaultValue) => value ? value : defaultValue;

const displayValue = (settings, key, isValid, defaultValue) => {
    if(key in settings.pending && isValid(settings.pending[key]))
        return valueOrDefault(settings.pending[key], defaultValue);
    return valueOrDefault(settings.current[key], defaultValue);
}

const isChanged = (settings, key) => key in settings.pending && settings.pending[key];
 
const displayTextValue = (settings, key) => displayValue(settings, key, (v) => v && v !== '', '')


const Settings = ({settings, onChange, reset, update}) => {

    const InputButtons = ({settingsKey}) => (
        <Button.Group>
            <Button content='update' primary disabled={!isChanged(settings, settingsKey)} onClick={() => update(settingsKey, settings.pending[settingsKey])} />
            <Button content='reset' onClick={() => reset(settingsKey)} disabled={!isChanged(settings, settingsKey)}/>
        </Button.Group>
    )

    const onInputChange = (key) => (e, data) => onChange(key, data.value);

    const InputIcon = ({settingsKey}) => isChanged(settings, settingsKey) ? <Icon name='edit' /> : null;
    return (
        <Container>
            <Form>
                <Segment>
                    <Header content='General' />
                    <Form.Input
                        label='Sequences data directory'
                        fluid
                        type='text'
                        icon={<InputIcon settingsKey='sequences_dir' />}
                        iconPosition='left'
                        value={displayTextValue(settings, 'sequences_dir', '')}
                        onChange={onInputChange('sequences_dir')}
                        action={<InputButtons settingsKey='sequences_dir' />}
                    />
                    <Message attached='top' content='Sequences will save images inside this directory.' info />
                    <Divider hidden />
                    <Form.Input
                        label='INDI path prefix'
                        fluid
                        type='text'
                        icon={<InputIcon settingsKey='indi_prefix' />}
                        iconPosition='left'
                        value={displayTextValue(settings, 'indi_prefix', '')}
                        onChange={onInputChange('indi_prefix')}
                        action={<InputButtons settingsKey='indi_prefix' />}
                    />
                    <Message attached='top' content='Only change this setting if you installed INDI on a custom path.' info />
                </Segment>
            </Form>


        </Container>
    )
}

export default Settings;
