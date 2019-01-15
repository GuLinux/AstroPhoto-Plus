import React from 'react'
import { Button, Label, Grid } from 'semantic-ui-react'

class INDIServicePage extends React.PureComponent {

    onServerStopStart = () => this.props.serverRunning ? this.props.stopService(this.props.serverConnected) : this.props.startService(this.props.drivers);

    render = () => {
        const {serverFound, serverRunning, startStopPending } = this.props;

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
                        <Button size="tiny" compact color={stateParams.buttonColor} onClick={this.onServerStopStart} disabled={startStopPending} content={stateParams.buttonLabel} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default INDIServicePage
