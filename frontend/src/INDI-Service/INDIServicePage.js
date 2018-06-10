import React from 'react'
import { Modal, Button, Header, Label, Grid } from 'semantic-ui-react'

const INDIServiceError = ({exitCode, stdout, stderr, onQuit}) => (
  <Modal.Dialog>
    <Modal.Header>INDI Service Error</Modal.Header>
    <Modal.Content>
            <Header size='small'>INDI server process has closed with an error.</Header>
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
    </Modal.Content>

    <Modal.Actions>
      <Button primary onClick={onQuit}>Close</Button>
    </Modal.Actions>
  </Modal.Dialog>
)

const INDIServicePage = ({serverFound, serverRunning, onServerStopStart, startStopPending, lastError, dismissError}) => {
    if(! serverFound)
        return null;
    const stateParams = {
        labelColor: serverRunning ? 'green' : 'red',
        label: serverRunning ? 'running' : 'not running',
        buttonColor: serverRunning ? 'orange': 'green',
        buttonLabel: serverRunning ? 'stop' : 'start',
    }

    return (
        <Grid columns={3}>
            <Grid.Row>
                <Grid.Column>Status</Grid.Column>
                <Grid.Column>
                    <Label color={stateParams.labelColor} size='mini'>
                        {stateParams.label}
                    </Label>
                </Grid.Column>
                <Grid.Column>
                    <Button size="tiny" compact color={stateParams.buttonColor} onClick={() => onServerStopStart()} disabled={startStopPending}>
                        {stateParams.buttonLabel}
                    </Button>
                </Grid.Column>
            </Grid.Row>
            {
                lastError.exitCode !== undefined ? <INDIServiceError {...lastError} onQuit={dismissError} /> : null
            }
        </Grid>
    )
}

export default INDIServicePage
