import React from 'react';
import { Header, Container, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { phd2PageSelector } from './selectors';

const PHD2Component = () => (
    <Container>
        <Grid>
            <Grid.Column width={3}>
                <Header size='small'>Connection</Header>
            </Grid.Column>
        </Grid>
    </Container>
);

export const PHD2 = connect(phd2PageSelector, {})(PHD2Component);

