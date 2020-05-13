import React from 'react'
import { connect } from 'react-redux';
import { networkManagerWifiConnectionDialogSelector, networkManagerSelector } from './selectors';
import { Menu, Header, Message, Input, Accordion, Label, Form, Modal, Grid, Icon, Button } from 'semantic-ui-react';
import { NumericInput } from '../components/NumericInput';
import { InputSetting } from './InputSetting';
import { set } from 'lodash/fp';

import { CheckButton } from '../components/CheckButton';
import { ConfirmDialog, ModalDialog } from '../Modals/ModalDialog';

import {
    networkManagerRemoveConnection,
    networkManagerAddWifi,
    networkManagerActivateConnection,
    networkManagerDeactivateConnection,
    getNetworkManagerAccessPoints,
    networkManagerClearAccessPoints,
    networkManagerUpdateWifi,
} from './actions';


class NetworkManagerWifiConnectionDialogComponent extends React.Component {
    constructor(props) {
        super(props);
        let connection = {
            ssid: '',
            psk: '',
            id: '',
            autoconnect: false,
            priority: 0,
            isAccessPoint: false,
        };
        if(props.connection) {
            Object.assign(connection, props.connection);
        }
        this.state = { otherSettings: false, connection, showPassword: false, showScanPage: false };
        this.scanTimer = 0;
    }


    modalTitle = () => this.props.connection ? 'Edit WiFi connection' : 'Add WiFi connection';
    submitButtonText = () => this.props.connection ? 'Save': 'Add';

    toggleOtherSettings = () => this.setState({otherSettings: !this.state.otherSettings});
    toggleShowPassword = e => this.setState({showPassword: !this.state.showPassword});
    showPasswordButton= () => <Button icon={this.state.showPassword ? 'eye slash' : 'eye'} onClick={this.toggleShowPassword} />;

    showScanPage = () => {
        this.props.networkManagerClearAccessPoints();
        this.scanTimer = setInterval(this.props.getNetworkManagerAccessPoints, 2000);
        this.props.getNetworkManagerAccessPoints();
        this.setState({ showScanPage: true });
    }

    hideScanPage = ssid => {
        clearInterval(this.scanTimer);
        let newState = set('showScanPage', false, this.state);
        if(ssid) {
            newState = set('connection.ssid', ssid, newState);
        }
        this.setState(newState);
    }

    componentDidUpdate = (_, prevState) => {
        if(this.state.connection.ssid !== prevState.connection.ssid && (this.state.connection.id === '' || this.state.connection.id === prevState.connection.ssid)) {
            this.setField('id', this.state.connection.ssid);
        }
    }

    setField= (field, value) => this.setState(set(`connection.${field}`, value, this.state));
    setSSID = (_, {value}) => this.setField('ssid', value);
    setName = (_, {value}) => this.setField('id', value);
    setPSK = (_, {value}) => this.setField('psk', value);
    setAutoconnect = (_, {checked}) => this.setField('autoconnect', checked);
    setWifiClient = () => this.setField('isAccessPoint', false);
    setWifiAP = () => this.setField('isAccessPoint', true);
    setPriority = value => this.setField('priority', value);

    preventFormSubmit = e => e.preventDefault();

    saveWifi = () => {
        if(this.props.connection) {
            let connection = {
                ...this.state.connection,
                id: this.props.connection.id,
                rename: this.state.connection.id,
            }
            this.props.networkManagerUpdateWifi(connection);
        } else {
            this.props.networkManagerAddWifi(this.state.connection);
        }
    }

    selectSSID = ssid => () => {
        this.hideScanPage(ssid);
    }

    renderScanAccessPoint = ({ssid, strength, frequency}) => (
        <Menu.Item key={ssid} onClick={this.selectSSID(ssid)}>
            <Label>strength: {strength}</Label>
            {ssid}
        </Menu.Item>
    );

    renderWifiList = () => (
        <React.Fragment>
            <Header size='small'>Available WiFi networks</Header>
            <Menu vertical fluid secondary>
                {this.props.accessPoints.map(this.renderScanAccessPoint)}
            </Menu>
        </React.Fragment>
    );

    renderWifiForm = () => (
        <Form autoComplete='off' onSubmit={this.preventFormSubmit}>
            <Form.Field>
                <label>ESSID (network name)</label>
                <Input fluid label={<Button content='Scan' onClick={this.showScanPage} />} labelPosition='right' placeholder='ESSID' value={this.state.connection.ssid} onChange={this.setSSID} />
            </Form.Field>
            <Form.Field>
                <label>Password</label>
                <Input placeholder='Password' value={this.state.connection.psk} onChange={this.setPSK} type={this.state.showPassword ? 'text' : 'password'} label={this.showPasswordButton()} labelPosition='right' />
            </Form.Field>
            <Form.Field inline>
                <label>WiFi Mode</label>
                <Button.Group size='mini'>
                    <CheckButton onClick={this.setWifiClient} active={!this.state.connection.isAccessPoint} content='Client' />
                    <CheckButton onClick={this.setWifiAP} active={this.state.connection.isAccessPoint} content='Access Point (shared)' />
                </Button.Group>
            </Form.Field>
            <Form.Checkbox label='Autoconnect' toggle checked={this.state.connection.autoconnect} onClick={this.setAutoconnect} />
            { this.state.connection.autoconnect && (
            <Form.Field>
                <label>Priority</label>
                <NumericInput min={0} max={99} step={1} placeholder='Autoconnect priority' value={this.state.connection.priority} onChange={this.setPriority} />
            </Form.Field>
            )}
            <Accordion as={Form.Field} >
                <Accordion.Title icon='dropdown' content='Other settings' active={this.state.otherSettings} onClick={this.toggleOtherSettings} />
                <Accordion.Content active={this.state.otherSettings}>
                    <Form.Input placeholder='Display Name' label='Display name' value={this.state.connection.id} onChange={this.setName} />
                </Accordion.Content>
            </Accordion>
        </Form>
    );

    render = () => (
        <ModalDialog 
            basic
            trigger={this.props.trigger}
            centered={false}
            size='small'
        >
            <Modal.Header>{this.modalTitle()}</Modal.Header>
            <Modal.Content>
                { !this.state.showScanPage && this.renderWifiForm() }
                { this.state.showScanPage && this.renderWifiList() }
            </Modal.Content>
            <Modal.Actions>
                { this.state.showScanPage && <Button content='Back' onClick={this.hideScanPage} /> }
                { !this.state.showScanPage && (
                    <React.Fragment>
                        <ModalDialog.CloseButton content='Cancel' />
                        <ModalDialog.CloseButton
                            content={this.submitButtonText()}
                            primary
                            onClose={this.saveWifi}
                        />
                    </React.Fragment>
                )}
            </Modal.Actions>
        </ModalDialog>
    );
}

const NetworkManagerWifiConnectionDialog = connect(networkManagerWifiConnectionDialogSelector, {
    networkManagerClearAccessPoints,
    getNetworkManagerAccessPoints,
    networkManagerAddWifi,
    networkManagerUpdateWifi,
})(NetworkManagerWifiConnectionDialogComponent);

const networkTypeIcons = {
    wifi: 'wifi',
    ethernet: 'computer',
};


class NetworkManagerConnectionComponent extends React.Component {

    activate = () => this.props.networkManagerActivateConnection(this.props.connection.id);
    deactivate = () => this.props.networkManagerDeactivateConnection(this.props.connection.id);
    remove = () => this.props.networkManagerRemoveConnection(this.props.connection.id);

    render = () => {
        const {id, type, active, isAccessPoint} = this.props.connection;
        return (
            <Grid.Row>
                <Grid.Column width={2} />
                <Grid.Column width={9}>
                    <Icon name={active ? 'check circle' : 'stop circle'} color={active ? 'green' : 'grey'} />
                    <Icon name={networkTypeIcons[type]} />
                    {isAccessPoint && <Label horizontal size='mini' color='yellow'>Access Point mode</Label> }
                    {id}

                </Grid.Column>
                <Grid.Column width={3}>
                    <Button.Group size='mini' fluid>
                        {active && <Button color='orange' onClick={this.deactivate} >Disconnect</Button>}
                        {!active && <Button color='green' onClick={this.activate} >Connect</Button>}
                        {!active && <ConfirmDialog
                            trigger={<Button color='red' content='Remove' />}
                            onConfirm={this.remove}
                            header='Confirm Network Removal'
                            content='This operation cannot be undone. Are you sure?'
                            cancelButton='Cancel'
                            confirmButton='Remove'
                            size='tiny'
                        />}
                        {!active && <NetworkManagerWifiConnectionDialog trigger={<Button disabled={type !== 'wifi'}>Edit</Button>} connection={this.props.connection} /> }
                    </Button.Group>
                </Grid.Column>
                <Grid.Column width={2} />
            </Grid.Row>
        );
    }
}

const NetworkManagerConnection = connect(null, {networkManagerRemoveConnection, networkManagerActivateConnection, networkManagerDeactivateConnection})(NetworkManagerConnectionComponent);

const formatAccessPointTimeout = n => n ? n : 'Disabled';


const NetworkManagerComponent = ({networks, autoAccessPointSSID}) => (
    <Grid stackable>
        {networks.map(network => <NetworkManagerConnection connection={network} key={network.id} />)}
        <Grid.Row>
            <Grid.Column width={11} />
            <Grid.Column width={3}>
                <NetworkManagerWifiConnectionDialog trigger={<Button size='mini' color='blue' fluid><Icon name='wifi' />Add WiFi connection</Button>} />
            </Grid.Column>
            <Grid.Column width={2} />
        </Grid.Row>
        <Grid.Row>
            <Grid.Column width={16}>
                <Form>
                    <InputSetting number setting='autoconnect_access_point_timeout' format={formatAccessPointTimeout} min={0} max={300} step={1} label='Automatically switch to AccessPoint mode' labelPrefix='seconds' />
                    <Message attached='top' info>
                        <p>When no other network is detected after the specified time, AstroPhoto-Plus will automatically start broadcasting its own network in Access Point mode. You can disable this feature by setting the value to "0"</p>
                        <p>The first network with the "Access Point" flag active will be used. If none is found, a new Network will be created with the following settings:</p>
                        <ul>
                            <li>SSID (network name): {autoAccessPointSSID}</li>
                            <li>Password: AstroPhoto-Plus</li>
                        </ul>
                    </Message>
                </Form>
            </Grid.Column>
        </Grid.Row>
    </Grid>
);

export const NetworkManager = connect(networkManagerSelector, {networkManagerAddWifi, getNetworkManagerAccessPoints})(NetworkManagerComponent);
