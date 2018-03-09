import React from 'react';
import { Button } from 'react-bootstrap';

const getConnectionView = (isConnected, connectAction, disconnectAction) => {
    return {
        stateLabelClass: isConnected ? 'success' : 'danger',
        stateLabel: isConnected ? 'Connected' : 'Disconnected',
        connectionButtonClass: isConnected ? 'danger' : 'success',
        connectionButtonLabel: isConnected ? 'Disconnect' : 'Connect',
        connectionButtonAction: isConnected? disconnectAction : connectAction,
    }
}

const INDIServerPage = ({serverState, setServerConnection}) => { 
    let connectionView = getConnectionView(serverState.connected);
    let connectionAction = () => setServerConnection(! serverState.connected);
    return (
    <div className="container">
        <div className="row">
            <div className="col-xs-8">
                <span className={'label label-' + connectionView.stateLabelClass}>{connectionView.stateLabel}</span>
                INDI Server  on {serverState.host}:{serverState.port}
            </div>
            <div className="col-xs-2"><Button bsStyle={connectionView.connectionButtonClass} onClick={connectionAction}>{connectionView.connectionButtonLabel}</Button></div>
        </div>
    </div>
)}
export default INDIServerPage;


