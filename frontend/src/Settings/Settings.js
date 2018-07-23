import React from 'react';
import { Form, Container, Button, Message, Icon, Divider, Segment, Header} from 'semantic-ui-react';
import { DirectoryPicker } from '../components/DirectoryPicker'; 
import { ModalDialog } from '../Modals/ModalDialog'; 

const valueOrDefault = (value, defaultValue) => value ? value : defaultValue;

const displayValue = (settings, key, isValid, defaultValue) => {
    if(key in settings.pending && isValid(settings.pending[key]))
        return valueOrDefault(settings.pending[key], defaultValue);
    return valueOrDefault(settings.current[key], defaultValue);
}

const isChanged = (settings, key) => key in settings.pending && settings.pending[key];
 
const displayTextValue = (settings, key) => displayValue(settings, key, (v) => v && v !== '', '')


const Settings = ({settings, onChange, reset, update}) => {

    const InputButtons = ({settingsKey, customButtons=null}) => (
        <Button.Group>
            {customButtons}
            <Button content='update' primary disabled={!isChanged(settings, settingsKey)} onClick={() => update(settingsKey, settings.pending[settingsKey])} />
            <Button content='reset' onClick={() => reset(settingsKey)} disabled={!isChanged(settings, settingsKey)}/>
        </Button.Group>
    )

    const onInputChange = (key) => (e, data) => onChange(key, data.value);

    const InputIcon = ({settingsKey}) => isChanged(settings, settingsKey) ? <Icon name='edit' /> : null;
    const currentSequencesDir = displayTextValue(settings, 'sequences_dir', '');
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
                        value={currentSequencesDir}
                        onChange={onInputChange('sequences_dir')}
                        action={<InputButtons settingsKey='sequences_dir' customButtons={
                            <DirectoryPicker currentDirectory={currentSequencesDir} onSelected={
                                (dir) => onChange('sequences_dir', dir)
                                } trigger={
                                <Button content='Select...' icon='folder' />
                            } />
                        } />}
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
