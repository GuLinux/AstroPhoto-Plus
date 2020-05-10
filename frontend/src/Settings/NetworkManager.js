import React from 'react'
import { connect } from 'react-redux';
import { networkManagerSelector } from './selectors';
import { Grid, Icon, Button } from 'semantic-ui-react';

import {
    networkManagerRemoveConnection,
    networkManagerAddWifi,
    networkManagerActivateConnection,
    networkManagerDeactivateConnection,
    getNetworkManagerAccessPoints,
} from './actions';

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
                    {id}
                    {isAccessPoint && <Label size='mini' color='yellow'>Access Point mode</Label> }
                </Grid.Column>
                <Grid.Column width={3}>
                    <Button.Group size='mini' fluid>
                        {active && <Button color='orange' onClick={this.deactivate} >Disconnect</Button>}
                        {!active && <Button color='green' onClick={this.activate} >Connect</Button>}
                        {false && <Button color='grey' onClick={this.remove} >Edit</Button>}
                        <Button color='red'>Remove</Button>
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
            <Grid.Column width={3}><Button size='mini' color='blue' fluid><Icon name='wifi' />Add WiFi connection</Button></Grid.Column>
            <Grid.Column width={2} />
        </Grid.Row>
    </Grid>
);

export const NetworkManager = connect(networkManagerSelector, {networkManagerAddWifi, getNetworkManagerAccessPoints})(NetworkManagerComponent);
