import React from 'react';
import { Button } from 'react-bootstrap';

const getConnectionView = (isConnected, connectAction, disconnectAction) => {
    return {
        stateLabelClass: isConnected ? 'success' : 'danger',
        stateLabel: isConnected ? 'Connected' : 'Disconnected',
        connectionButtonClass: isConnected ? 'warning' : 'success',
        connectionButtonLabel: isConnected ? 'Disconnect' : 'Connect',
        connectionButtonAction: isConnected? disconnectAction : connectAction,
    }
}

const INDIServerDetailsPage = ({serverState, setServerConnection}) => {
    let connectionView = getConnectionView(serverState.connected);
    let connectionAction = () => setServerConnection(! serverState.connected);
    return (
        <div className="indi-server-details-container container-fluid">
            <div className="row">
                <div className="col-xs-2">Address</div>
                <div className="col-xs-6">{serverState.host}:{serverState.port}</div>
            </div>
            <hr />
            <div className="row">
                <div className="col-xs-2">Connection</div>
                <div className="col-xs-2"><span className={'label label-' + connectionView.stateLabelClass}>{connectionView.stateLabel}</span></div>
                <div className="col-xs-2"><Button bsSize="xsmall" bsStyle={connectionView.connectionButtonClass} onClick={connectionAction}>{connectionView.connectionButtonLabel}</Button></div>
            </div>
        </div>
)}

export default INDIServerDetailsPage
