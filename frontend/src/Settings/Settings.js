import React from 'react';
import { Button, Dropdown, Menu, Grid, Form, Container, Message, Icon, Divider, Segment, Header, Label} from 'semantic-ui-react';
import { DirectoryPicker } from '../components/DirectoryPicker'; 
import { CommandsContainer } from '../Commands/CommandsContainer';
import { CheckButton } from '../components/CheckButton';
import { get } from 'lodash'; 
import { DownloadIndexesModalContainer } from './DownloadIndexesModalContainer';
import { NumericInput } from '../components/NumericInput';
 
export class Settings extends React.Component {

    displayValue = (key, isValid, defaultValue) => {
        const currentValue = get(this.props.settings, ['current', key], defaultValue);
        return get(this.props.settings, ['pending', key], currentValue);
    }

    isChanged = key => get(this.props.settings, ['pending', key]);
    
    displayTextValue = key => this.displayValue(key, (v) => v && v !== '', '')
    
    settingButton = (setting, value, props) =>
        <CheckButton active={get(this.props.settings, ['current', setting]) === value} onClick={() => this.props.update(setting, value)} {...props} />


    inputButtons = (settingsKey, customButtons=null) => (
        <Dropdown direction='left' button basic floating icon='ellipsis horizontal'>
            <Dropdown.Menu>
                {customButtons}
                <Dropdown.Item content='update' disabled={!this.isChanged(settingsKey)} onClick={() => this.props.update(settingsKey, this.props.settings.pending[settingsKey])} />
                <Dropdown.Item content='reset' onClick={() => this.props.reset(settingsKey)} disabled={!this.isChanged(settingsKey)}/>
            </Dropdown.Menu>
        </Dropdown>
    )

    changedItemWarning = settingsKey => this.isChanged(settingsKey) && (
        <Label color='yellow' pointing>
            This settings is not saved. Please click the Save button to apply it.
        </Label>
    );

    onInputChange = (key) => (e, data) => this.props.onChange(key, data.value);
    getIconProp = (settingsKey) => this.isChanged(settingsKey) ? { iconPosition: 'left', icon: <Icon name='edit' />} : {};
 
    checkbox = (valueName, props={}) => <Form.Checkbox
        checked={get(this.props.settings, ['current', valueName], 0) !== 0}
        onChange={(e, data) => this.props.update(valueName, data.checked)}
        {...props}
    />;

    onAstrometryTimeoutChanged = value => this.props.update('astrometry_cpu_limit', value);
    onServerNameChanged = value => this.props.update('server_name', value);


    render = () => {
        const {onChange, showCommands, backendVersion='N/A', frontendVersion} = this.props;
        const currentSequencesDir = this.displayTextValue('sequences_dir', '');
        const currentINDIPath = this.displayTextValue('indi_prefix', '');
        const currentAstrometryTimeout = this.displayValue('astrometry_cpu_limit') || '';
        return (
            <Container>
                <Segment>
                    <Header content='About' />
                    <Grid stackable>
                        <Grid.Column width={6} verticalAlign='middle'>
                            {
                                backendVersion === frontendVersion ?
                                    `AstroPhoto Plus version ${backendVersion}`
                                :
                                    `AstroPhoto Plus: backend version ${backendVersion}, frontend: ${frontendVersion}`
                            }
                        </Grid.Column>
                        <Grid.Column textAlign='right' width={10} verticalAlign='middle'>
                            <Menu compact stackable>
                                <Menu.Item content='Homepage' as='a' href='https://astrophotoplus.gulinux.net' target='_blank' />
                                <Menu.Item content='Report an issue' as='a' href='https://github.com/GuLinux/AstroPhoto-Plus/issues' target='_blank' />
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
                        <Segment>
                            <Header content='Application Settings' />
                            <Form.Input
                                label='Server name'
                                fluid
                                type='text'
                                value={this.displayTextValue('server_name')}
                                onChange={this.onInputChange('server_name')}
                                action={this.inputButtons('server_name')}
                            />
                            {this.changedItemWarning('server_name')}
                        </Segment>

                        <Segment>
                            <Header content='Paths' />
                            <Form.Input
                                label='Sequences data directory'
                                fluid
                                type='text'
                                {...this.getIconProp('sequences_dir')}
                                value={currentSequencesDir}
                                onChange={this.onInputChange('sequences_dir')}
                                action={this.inputButtons('sequences_dir', (
                                    <DirectoryPicker currentDirectory={currentSequencesDir} onSelected={
                                        (dir) => onChange('sequences_dir', dir)
                                        } trigger={
                                        <Dropdown.Item content='Browse...' icon='folder' />
                                    } />
                                 ))}
                            />
                            {this.changedItemWarning('sequences_dir')}
                            <Message attached='top' content='Sequences will save images inside this directory.' info />
                            <Divider hidden />
                            <Form.Input
                                label='INDI path prefix'
                                fluid
                                type='text'
                                {...this.getIconProp('indi_prefix')}
                                value={currentINDIPath}
                                onChange={this.onInputChange('indi_prefix')}
                                action={this.inputButtons('indi_prefix', (
                                    <DirectoryPicker currentDirectory={currentINDIPath} onSelected={
                                        (dir) => onChange('indi_prefix', dir)
                                        } trigger={
                                        <Dropdown.Item content='Browse...' icon='folder' />
                                    } />
                                ))}
                            />
                            {this.changedItemWarning('indi_prefix')}
                            <Message attached='top' content='Only change this setting if you installed INDI on a custom path.' info />
                        </Segment>
                        <Segment>
                            <Header content='INDI' />
                            {this.checkbox('indi_server_autoconnect', {label: 'Autoconnect to INDI server', toggle: true})}
                            <Message>Connect automatically to INDI server</Message>
                            {this.checkbox('indi_drivers_autostart', {label: 'Autostart INDI drivers', toggle: true})}
                            <Message>Autostart INDI drivers on connection</Message>
                        </Segment>
                        <Segment>
                            <Header content='Plate Solving' />
                            <Form.Field>
                                <DownloadIndexesModalContainer
                                    trigger={
                                        <Button
                                            icon='download'
                                            content='Download Astrometry.net Index files'
                                            primary
                                            disabled={this.props.astrometryIsDownloading}
                                        />}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Timeout for field solving</label>
                                <NumericInput min={150} max={9999} step={1} value={currentAstrometryTimeout} label='seconds' onChange={this.onAstrometryTimeoutChanged} />
                            </Form.Field>
                        </Segment>
                        <Segment>
                            <Header content='Misc' />
                            <Form.Group inline>
                                <label>Log level</label>
                                {this.settingButton('log_level', 'CRITICAL', {size: 'mini', content: 'Critical'})}
                                {this.settingButton('log_level', 'ERROR', {size: 'mini', content: 'Error'})}
                                {this.settingButton('log_level', 'WARNING', {size: 'mini', content: 'Warning'})}
                                {this.settingButton('log_level', 'INFO', {size: 'mini', content: 'Info'})}
                                {this.settingButton('log_level', 'DEBUG', {size: 'mini', content: 'Debug'})}
                            </Form.Group>
                            <Divider hidden />
                            {this.checkbox('sequence_async', {label: 'Asynchronous file saving', toggle: true})}
                            <Message>If enabled (default), will use memory buffering to improve sequences speed, saving a file while taking the next shot. Disable if you run on a low memory system</Message>
                        </Segment>
                    </Segment>
                </Form>
            </Container>
        ) 
    }
}
