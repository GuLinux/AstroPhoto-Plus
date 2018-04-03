import React from 'react';
import { Button, Table } from 'react-bootstrap';

const getConnectionView = (isConnected, connectAction, disconnectAction) => {
    return {
        stateLabelClass: isConnected ? 'success' : 'danger',
        stateLabel: isConnected ? 'Connected' : 'Disconnected',
        connectionButtonClass: isConnected ? 'danger' : 'success',
        connectionButtonLabel: isConnected ? 'Disconnect' : 'Connect',
        connectionButtonAction: isConnected? disconnectAction : connectAction,
    }
}

const INDIServerDetailsPage = ({serverState, setServerConnection}) => {
    let connectionView = getConnectionView(serverState.connected);
    let connectionAction = () => setServerConnection(! serverState.connected);
    return (
        <Table bordered hover>
            <tbody>
                <tr>
                    <th>Address</th>
                    <td colSpan="2">{serverState.host}:{serverState.port}</td>
                </tr>
                <tr>
                    <th>Connection</th>
                    <td><span className={'label label-' + connectionView.stateLabelClass}>{connectionView.stateLabel}</span></td>
                    <td><Button bsSize="xsmall" bsStyle={connectionView.connectionButtonClass} onClick={connectionAction}>{connectionView.connectionButtonLabel}</Button></td>
                </tr>
            </tbody>
        </Table>
)}

export default INDIServerDetailsPage
