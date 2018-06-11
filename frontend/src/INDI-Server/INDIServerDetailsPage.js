import React from 'react';
import { Button, Grid , Divider, Label} from 'semantic-ui-react';

const getConnectionView = (isConnected, connectAction, disconnectAction) => {
    return {
        stateLabelColor: isConnected ? 'green' : 'red',
        stateLabel: isConnected ? 'Connected' : 'Disconnected',
        connectionButtonColor: isConnected ? 'orange' : 'green',
        connectionButtonLabel: isConnected ? 'Disconnect' : 'Connect',
        connectionButtonAction: isConnected? disconnectAction : connectAction,
    }
}

const INDIServerDetailsPage = ({serverState, setServerConnection}) => {
    let connectionView = getConnectionView(serverState.connected);
    let connectionAction = () => setServerConnection(! serverState.connected);
    return (
        <Grid columns={3}>
            <Grid.Row>
                <Grid.Column>Address</Grid.Column>
                <Grid.Column size={2}>{serverState.host}:{serverState.port}</Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row>
                <Grid.Column>
                    Connection
                </Grid.Column>
                <Grid.Column>
                    <Label color={connectionView.stateLabelColor} size='mini'>
                        {connectionView.stateLabel}
                    </Label>
                </Grid.Column>
                <Grid.Column>
                    <Button size="mini" color={connectionView.connectionButtonColor} onClick={connectionAction} compact>
                        {connectionView.connectionButtonLabel}
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
)}

export default INDIServerDetailsPage
