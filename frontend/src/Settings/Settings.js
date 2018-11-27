import React from 'react';
import { Dropdown, Menu, Grid, Form, Container, Button, Message, Icon, Divider, Segment, Header} from 'semantic-ui-react';
import { DirectoryPicker } from '../components/DirectoryPicker'; 
import { CommandsContainer } from '../Commands/CommandsContainer';
import { CheckButton } from '../components/CheckButton';

const valueOrDefault = (value, defaultValue) => value ? value : defaultValue;

const displayValue = (settings, key, isValid, defaultValue) => {
    if(key in settings.pending && isValid(settings.pending[key]))
        return valueOrDefault(settings.pending[key], defaultValue);
    return valueOrDefault(settings.current[key], defaultValue);
}

const isChanged = (settings, key) => key in settings.pending && settings.pending[key];
 
const displayTextValue = (settings, key) => displayValue(settings, key, (v) => v && v !== '', '')

const SettingButton = ({settings, setting, value, onUpdate, ...props}) => (
    <CheckButton active={settings.current[setting] === value} onClick={() => onUpdate(setting, value)} {...props} />
)



const Settings = ({settings, onChange, reset, update, showCommands, version='N/A'}) => {
    const InputButtons = ({settingsKey, customButtons=null}) => (
        <Dropdown direction='left' button basic floating icon='ellipsis horizontal'>
            <Dropdown.Menu>
                {customButtons}
                <Dropdown.Item content='update' disabled={!isChanged(settings, settingsKey)} onClick={() => update(settingsKey, settings.pending[settingsKey])} />
                <Dropdown.Item content='reset' onClick={() => reset(settingsKey)} disabled={!isChanged(settings, settingsKey)}/>
            </Dropdown.Menu>
        </Dropdown>
    )

    const onInputChange = (key) => (e, data) => onChange(key, data.value);
    const getIconProp = (settingsKey) => isChanged(settings, settingsKey) ? { iconPosition: 'left', icon: <Icon name='edit' />} : {};
 
    const currentSequencesDir = displayTextValue(settings, 'sequences_dir', '');
    const currentINDIPath = displayTextValue(settings, 'indi_prefix', '');

    return (
        <Container>
            <Segment>
                <Header content='About' />
                <Grid stackable>
                    <Grid.Column width={6} verticalAlign='middle'>
                        StarQuew version {version}
                    </Grid.Column>
                    <Grid.Column textAlign='right' width={10} verticalAlign='middle'>
                        <Menu compact stackable>
                            <Menu.Item content='Homepage' as='a' href='https://github.com/GuLinux/StarQuew' target='_blank' />
                            <Menu.Item content='Report an issue' as='a' href='https://github.com/GuLinux/StarQuew/issues' target='_blank' />
                            <Menu.Item content='Author homepage' as='a' href='https://gulinux.net' target='_blank' />
                        </Menu>
                    </Grid.Column>
                </Grid>
            </Segment>
            { showCommands && (
                <Segment>
                    <Header content='Commands' />
                    <CommandsContainer />
                </Segment>
            )}
            <Form>
                <Segment>
                    <Header content='Settings' />
                    <Form.Input
                        label='Sequences data directory'
                        fluid
                        type='text'
                        {...getIconProp('sequences_dir')}
                        value={currentSequencesDir}
                        onChange={onInputChange('sequences_dir')}
                        action={<InputButtons settingsKey='sequences_dir' customButtons={
                            <DirectoryPicker currentDirectory={currentSequencesDir} onSelected={
                                (dir) => onChange('sequences_dir', dir)
                                } trigger={
                                <Dropdown.Item content='Browse...' icon='folder' />
                            } />
                        } />}
                    />
                    <Message attached='top' content='Sequences will save images inside this directory.' info />
                    <Divider hidden />
                    <Form.Input
                        label='INDI path prefix'
                        fluid
                        type='text'
                        {...getIconProp('indi_prefix')}
                        value={currentINDIPath}
                        onChange={onInputChange('indi_prefix')}
                        action={<InputButtons settingsKey='indi_prefix' customButtons={
                            <DirectoryPicker currentDirectory={currentINDIPath} onSelected={
                                (dir) => onChange('indi_prefix', dir)
                                } trigger={
                                <Dropdown.Item content='Browse...' icon='folder' />
                            } />
                        } />}
                    />
                    <Message attached='top' content='Only change this setting if you installed INDI on a custom path.' info />
                    <Divider hidden />


                    <Form.Group inline>
                        <label>Log level</label>
                        <SettingButton size='mini' content='Critical' value='CRITICAL' settings={settings} setting='log_level' onUpdate={update} />
                        <SettingButton size='mini' content='Error' value='ERROR' settings={settings} setting='log_level' onUpdate={update} />
                        <SettingButton size='mini' content='Warning' value='WARNING' settings={settings} setting='log_level' onUpdate={update} />
                        <SettingButton size='mini' content='Info' value='INFO' settings={settings} setting='log_level' onUpdate={update} />
                        <SettingButton size='mini' content='Debug' value='DEBUG' settings={settings} setting='log_level' onUpdate={update} />
                    </Form.Group>
                    <Divider hidden />

                    <Form.Checkbox label='Asynchronous file saving' toggle checked={settings.current && settings.current.sequence_async} onChange={(e, data) => update('sequence_async', data.checked)} />
                    <Message>If enabled (default), will use memory buffering to improve sequences speed, saving a file while taking the next shot. Disable if you run on a low memory system</Message>

                </Segment>
            </Form>


        </Container>
    )
}

export default Settings;
