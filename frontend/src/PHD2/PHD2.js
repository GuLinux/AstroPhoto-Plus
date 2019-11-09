import React from 'react';
import { Header, Container, Grid, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { phd2PageSelector } from './selectors';
import { DitheringOptions } from '../Autoguider/DitheringOptions';
import { PHD2StartProcess } from './PHD2StartProcess';
import { PHD2DevicesProfiles } from './PHD2DevicesProfiles';
import { PHD2Graph } from './PHD2Graph';

const connectionMessage = (connected, connectionError) => {
    if(connected) {
        return 'Connected';
    }
    if(connectionError) {
        return `Disconnected: ${connectionError}`;
    }
    return 'Disconnected';
}

const PHD2Version = ({ version }) => version ? (
    <Grid.Row>
        <Grid.Column width={3} verticalAlign='middle'>
            <Header size='small'>PHD2 Version</Header>
        </Grid.Column>
        <Grid.Column width={9}>
            <Message content={version} size='mini' />
        </Grid.Column>
    </Grid.Row>
) : null;

const PHD2ProcessRow = () => (
    <Grid.Row>
        <Grid.Column width={3} verticalAlign='middle'>
            <Header size='small'>Start PHD2</Header>
        </Grid.Column>
        <Grid.Column width={9}>
            <PHD2StartProcess />
        </Grid.Column>
    </Grid.Row>
)

const PHD2DevicesProfilesRow = ({}) => (
    <Grid.Row>
            <Grid.Column width={3} verticalAlign='middle'>
                <Header size='small'>Hardware Profiles</Header>
            </Grid.Column>
            <Grid.Column width={9}>
                <PHD2DevicesProfiles />
            </Grid.Column>
    </Grid.Row>
);

const uiState = state => {
    switch(state) {
        case 'Selected':
            return 'Star selected';
        case 'Looping':
            return 'Looping exposures';
        case 'LostLock':
            return 'Lost lock position (star lost)';
        default:
            return state;
    }
}

const stateColor = state => {
    switch(state) {
        case 'Calibrating':
            return 'yellow';
        case 'Looping':
            return 'olive';
        case 'Selected':
            return 'teal';
        default:
            return null;
    }
}

const PHD2State = ({ state }) => state ? (
    <Grid.Row>
        <Grid.Column width={3} verticalAlign='middle'>
            <Header size='small'>PHD2 State</Header>
        </Grid.Column>
        <Grid.Column width={9}>
            <Message content={uiState(state)} size='mini' color={stateColor(state)} success={state==='Guiding'} error={state==='LostLock'}/>
        </Grid.Column>
    </Grid.Row>
) : null;

const PHD2StatusComponent = ({version, phd2State}) => (
    <React.Fragment>
        <PHD2Version version={version} />
        <PHD2State state={phd2State} />
    </React.Fragment>
);

const PHD2Component = ({connected, connectionError, showProcessRow, version, phd2State}) => (
    <Container>
        <Grid columns={12}>
            { showProcessRow && <PHD2ProcessRow process={process} connected={connected} /> }
            <Grid.Row><PHD2Graph /></Grid.Row>
            <Grid.Row>
                <Grid.Column width={3} verticalAlign='middle'>
                    <Header size='small'>Connection</Header>
                </Grid.Column>
                <Grid.Column width={9}>
                    <Message positive={connected} error={!connected} content={connectionMessage(connected, connectionError)} size='mini' />
                </Grid.Column>
            </Grid.Row>
            { connected && <PHD2StatusComponent version={version} phd2State={phd2State} /> }
            { connected && <PHD2DevicesProfilesRow /> }
        </Grid>
        <DitheringOptions />
    </Container>
);

export const PHD2 = connect(phd2PageSelector, null)(PHD2Component);

