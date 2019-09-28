import React from 'react';
import { List, Button, Dropdown, Menu, Grid, Form, Container, Message, Icon, Divider, Segment, Header, Label} from 'semantic-ui-react';
import { DirectoryPicker } from '../components/DirectoryPicker'; 
import { CommandsContainer } from '../Commands/CommandsContainer';
import { CheckButton } from '../components/CheckButton';
import { get } from 'lodash'; 
import { DownloadIndexesModalContainer } from './DownloadIndexesModalContainer';
import { NumericInput } from '../components/NumericInput';

import { InputSetting } from './InputSetting';
 
export class Settings extends React.Component {
    settingButton = (setting, value, props) =>
        <CheckButton active={get(this.props.settings, ['current', setting]) === value} onClick={() => this.props.update(setting, value)} {...props} />

    checkbox = (valueName, props={}) => <Form.Checkbox
        checked={get(this.props.settings, ['current', valueName], 0) !== 0}
        onChange={(e, data) => this.props.update(valueName, data.checked)}
        {...props}
    />;

    onAstrometryTimeoutChanged = value => this.props.update('astrometry_cpu_limit', value);
    onServerNameChanged = value => this.props.update('server_name', value);

    render = () => {
        const {onChange, showCommands, backendVersion='N/A', frontendVersion, catalogs, availableCatalogs, importCatalog } = this.props;
        const versionString = backendVersion === frontendVersion ? `AstroPhoto Plus version ${backendVersion}` : `AstroPhoto Plus: backend version ${backendVersion}, frontend: ${frontendVersion}`;

        return (
            <Container>
                <Segment>
                    <Header content='About' />
                    <Grid stackable>
                        <Grid.Column width={6} verticalAlign='middle'>
                            {versionString}
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
                            <InputSetting text setting='server_name' label='Server name' fluid />
                        </Segment>

                        <Segment>
                            <Header content='Paths' />

                            <InputSetting setting='sequences_dir' label='Sequences data directory' path fluid />
                            <Message attached='top' content='Sequences will save images inside this directory.' info />

                            <Divider hidden />

                            <InputSetting setting='indi_prefix' label='INDI path prefix' path fluid />
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
                            <InputSetting number setting='astrometry_cpu_limit' label='Timeout for field solving' fluid min={150} max={999} step={1} labelPrefix='seconds' />
                        </Segment>
                        <Segment>
                            <Header content='Catalogs' />
                            {catalogs && catalogs.length > 0 && (
                                <React.Fragment>
                                    <Header size='small' content='Current catalogs:' />
                                    <List>
                                        {catalogs.map(catalog => (
                                            <List.Item key={catalog.catalogName}>
                                                <List.Header content={catalog.display_name} /> {catalog.items} entries.
                                            </List.Item>
                                        ))}
                                    </List>
                                </React.Fragment>
                            )}
                            {availableCatalogs && availableCatalogs.length > 0 && (
                                <React.Fragment>
                                    <Header size='small' content='Download catalogs' />
                                    <Menu vertical fluid>
                                        <Dropdown direction='left' floating item text='Select a catalog to download' disabled={this.props.catalogsImporting} >
                                            <Dropdown.Menu>
                                                {availableCatalogs.map(catalog => <Dropdown.Item onClick={() => importCatalog(catalog.catalogDownloadName, catalog.display_name)} key={catalog.catalogDownloadName} text={catalog.display_name} />)}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Menu>
                                </React.Fragment>
                            )}
                        </Segment>
                        <Segment>
                            <Header content='Autoguider' />
                            <Form.Group inline>
                                <label>Autoguider engine</label>
                                {this.settingButton('autoguider_engine', 'off', {size: 'mini', content: 'Off'})}
                                {this.settingButton('autoguider_engine', 'phd2', {size: 'mini', content: 'PHD2'})}
                            </Form.Group>
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
