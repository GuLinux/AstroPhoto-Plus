import React from 'react';
import { Container, Header, Button, Label, Segment, Grid, Message } from 'semantic-ui-react';

export class Autoguiding extends React.Component {
    constructor(props) {
        super(props);
        this.state = { options: {} };
    }

    startPHD2Server = () => this.props.startPHD2Server(this.state.options);

    renderStatusLabel = () => {
        let color = 'orange';
        let content = 'stopped';
        if(this.props.isRunning) {
            color = 'green';
            content='started';
        }
        return <Label color={color} content={content} />
    }

    renderServerStatusOptions = () => {
        let statusLabel = 'stopped';
        let statusColor = 'orange';
        let buttonColor = 'green';
        let buttonLabel = 'Start';
        let buttonAction = this.startPHD2Server;
        let description = '';
        if(this.props.isRunning) {
            statusLabel = 'running';
            statusColor = 'green';
            buttonColor = 'orange';
            buttonLabel = 'Stop';
            buttonAction = this.props.stopPHD2Server;
            description = `You can connect to the PHD2 VNC server using your favourite VNC client (display ${this.props.vncDisplay}).`;
        }
        if(this.props.serverAlreadyRunning) {
            statusLabel = 'already started';
            statusColor = 'yellow';
            buttonColor = 'orange';
            buttonLabel = 'Reset';
            buttonAction = this.props.resetPHD2Server;
            description = `PHD2 VNC Server was already started with an external. You can reset it and restart, or connect to the PHD2 VNC server using your favourite VNC client (display ${this.props.vncDisplay}).`;
        }

        return { statusLabel, statusColor, buttonLabel, buttonAction, buttonColor, description};
    }

    renderStartButton = () => <Button content='Start' primary size='small' onClick={this.startPHD2Server} />
    renderStopButton = () => <Button content='Stop' primary size='small' onClick={this.props.stopPHD2Server} />

    render = () => {
        const { statusLabel, statusColor, buttonLabel, buttonAction, buttonColor, description } = this.renderServerStatusOptions();
        return (
            <Container>
                <Segment>
                    <Header content='PHD2 Server' />
                    <Grid columns={7} stackable>
                        <Grid.Column width={3}>
                            PHD2 Server status
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Label size='mini' color={statusColor} content={statusLabel} />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Button size='mini' onClick={buttonAction} compact color={buttonColor} content={buttonLabel} />
                        </Grid.Column>
                    </Grid>
                    {description && <Message size='mini'>{description}</Message>}
                </Segment>
            </Container>
        );
    }
}
