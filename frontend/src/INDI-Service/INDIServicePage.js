import React from 'react'
import { Modal, Button, Header, Label, Grid } from 'semantic-ui-react'

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
                    <Label color={stateParams.labelColor} size='mini' content={stateParams.label} />
                </Grid.Column>
                <Grid.Column>
                    <Button size="tiny" compact color={stateParams.buttonColor} onClick={() => onServerStopStart()} disabled={startStopPending} content={stateParams.buttonLabel} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default INDIServicePage
