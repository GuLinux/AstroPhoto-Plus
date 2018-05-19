import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const INDIServiceError = ({exitCode, stdout, stderr, onQuit}) => (
  <Modal.Dialog>
    <Modal.Header>
      <Modal.Title>INDI Service Error</Modal.Title>
    </Modal.Header>

    <Modal.Body className="indi-service-error-dialog">
            <h4>INDI server process has closed with an error.</h4>
            <p>Exit code: <b>{exitCode}</b></p>
            {stdout ? (
                <div>
                    <p>stdout:</p>
                    <pre>{stdout}</pre>
                </div>
            ) : null}
            {stderr? (
                <div>
                    <p>stderr:</p>
                    <pre>{stderr}</pre>
                </div>
        ) : null}
    </Modal.Body>

    <Modal.Footer>
      <Button bsStyle="primary" onClick={onQuit}>Close</Button>
    </Modal.Footer>
  </Modal.Dialog>
)

const INDIServicePage = ({serverFound, serverRunning, onServerStopStart, startStopPending, lastError, dismissError}) => {
    if(! serverFound)
        return null;
    const stateParams = {
        labelClass: serverRunning ? 'success' : 'danger',
        label: serverRunning ? 'running' : 'not running',
        buttonClass: serverRunning ? 'danger': 'success',
        buttonLabel: serverRunning ? 'stop' : 'start',
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xs-2">Status</div>
                <div className="col-xs-2"><span className={'label label-' + stateParams.labelClass}>{stateParams.label}</span></div>
                <div className="col-xs-2"><Button bsSize="xsmall" bsStyle={stateParams.buttonClass} onClick={() => onServerStopStart()} disabled={startStopPending}>{stateParams.buttonLabel}</Button></div>
            </div>
            {
                lastError.exitCode !== undefined ? <INDIServiceError {...lastError} onQuit={dismissError} /> : null
            }
        </div>
    )
}

export default INDIServicePage
