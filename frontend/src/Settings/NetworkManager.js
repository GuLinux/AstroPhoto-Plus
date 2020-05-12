import React from 'react'
import { connect } from 'react-redux';
import { networkManagerSelector } from './selectors';
import { Input, Accordion, Label, Form, Modal, Grid, Icon, Button } from 'semantic-ui-react';
import { NumericInput } from '../components/NumericInput';
import { set } from 'lodash/fp';

import { CheckButton } from '../components/CheckButton';
import { ConfirmDialog, ModalDialog } from '../Modals/ModalDialog';

import {
    networkManagerRemoveConnection,
    networkManagerAddWifi,
    networkManagerActivateConnection,
    networkManagerDeactivateConnection,
    getNetworkManagerAccessPoints,
} from './actions';


class NetworkManagerWifiConnectionDialogComponent extends React.Component {
    constructor(props) {
        super(props);
        let connection = {
            ssid: '',
            psk: '',
            networkName: '',
            autoconnect: false,
            priority: 0,
            apMode: false,
        };
        this.state = { otherSettings: false, connection, showPassword: false };
    }


    modalTitle = () => this.props.connection ? 'Edit WiFi connection' : 'Add WiFi connection';
    submitButtonText = () => this.props.connection ? 'Save': 'Add';

    toggleOtherSettings = () => this.setState({otherSettings: !this.state.otherSettings});
    toggleShowPassword = e => this.setState({showPassword: !this.state.showPassword});

    scanButton = () => false && <Button content='Scan' />;
    showPasswordButton= () => <Button icon={this.state.showPassword ? 'eye slash' : 'eye'} onClick={this.toggleShowPassword} />;

    setField= (field, value) => this.setState(set(`connection.${field}`, value, this.state));
    setSSID = (_, {value}) => this.setField('ssid', value);

    componentDidUpdate = (_, prevState) => {
        if(this.state.connection.ssid !== prevState.connection.ssid && (this.state.connection.networkName === '' || this.state.connection.networkName === prevState.connection.ssid)) {
            this.setField('networkName', this.state.connection.ssid);
        }
    }

    setName = (_, {value}) => this.setField('networkName', value);
    setPSK = (_, {value}) => this.setField('psk', value);
    setAutoconnect = (_, {checked}) => this.setField('autoconnect', checked);
    setWifiClient = () => this.setField('apMode', false);
    setWifiAP = () => this.setField('apMode', true);
    setPriority = value => this.setField('priority', value);

    preventFormSubmit = e => e.preventDefault();

    saveWifi = () => {
        if(this.props.connection) {
        } else {
            this.props.networkManagerAddWifi(this.state.connection);
        }
    }

    render = () => (
        <ModalDialog 
            basic
            trigger={this.props.trigger}
            centered={false}
            size='small'
        >
            <Modal.Header>{this.modalTitle()}</Modal.Header>
            <Modal.Content>
                <Form onSubmit={this.preventFormSubmit}>
                    <Form.Field>
                        <label>ESSID (network name)</label>
                        <Input fluid label={this.scanButton()} labelPosition='right' placeholder='ESSID' value={this.state.connection.ssid} onChange={this.setSSID} />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <Input placeholder='Password' value={this.state.connection.psk} onChange={this.setPSK} type={this.state.showPassword ? 'text' : 'password'} label={this.showPasswordButton()} labelPosition='right' />
                    </Form.Field>
                    <Form.Field inline>
                        <label>WiFi Mode</label>
                        <Button.Group size='mini'>
                            <CheckButton onClick={this.setWifiClient} active={!this.state.connection.apMode} content='Client' />
                            <CheckButton onClick={this.setWifiAP} active={this.state.connection.apMode} content='Access Point (shared)' />
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
                            <Form.Input placeholder='Display Name' label='Display name' value={this.state.connection.networkName} onChange={this.setName} />
                        </Accordion.Content>
                    </Accordion>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <ModalDialog.CloseButton content='Cancel' />
                <ModalDialog.CloseButton
                    content={this.submitButtonText()}
                    primary
                    onClose={this.saveWifi}
                />
            </Modal.Actions>
        </ModalDialog>
    );
}

const NetworkManagerWifiConnectionDialog = connect(null, { networkManagerAddWifi })(NetworkManagerWifiConnectionDialogComponent);

const networkTypeIcons = {
    wifi: 'wifi',
    ethernet: 'computer',
};


class NetworkManagerConnectionComponent extends React.Component {

    activate = () => this.props.networkManagerActivateConnection(this.props.id);
    deactivate = () => this.props.networkManagerDeactivateConnection(this.props.id);
    remove = () => this.props.networkManagerRemoveConnection(this.props.id);

    render = () => {
        const {id, type, active, isAccessPoint} = this.props;
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
                    </Button.Group>
                </Grid.Column>
                <Grid.Column width={2} />
            </Grid.Row>
        );
    }
}

const NetworkManagerConnection = connect(null, {networkManagerRemoveConnection, networkManagerActivateConnection, networkManagerDeactivateConnection})(NetworkManagerConnectionComponent);


const NetworkManagerComponent = ({networks}) => (
    <Grid stackable>
        {networks.map(network => <NetworkManagerConnection {...network} key={network.id} />)}
        <Grid.Row>
            <Grid.Column width={11} />
            <Grid.Column width={3}>
                <NetworkManagerWifiConnectionDialog trigger={<Button size='mini' color='blue' fluid><Icon name='wifi' />Add WiFi connection</Button>} />
            </Grid.Column>
            <Grid.Column width={2} />
        </Grid.Row>
    </Grid>
);

export const NetworkManager = connect(networkManagerSelector, {networkManagerAddWifi, getNetworkManagerAccessPoints})(NetworkManagerComponent);
