import React from 'react';
import { DARV } from './DARV';
import { PlatesolvingPolarAlignment } from './PlatesolvingPolarAlignment';
import { Routes } from '../routes';
import { Divider, Container, Menu} from 'semantic-ui-react';
import { Route } from 'react-router';
import { NavLink } from 'react-router-dom';
import { HistoryLandingContainer } from '../Navigation/HistoryLandingContainer';
import { DARV_PAGE, POLAR_PLATESOLVING} from '../Camera/sections';

export const PolarAlignmentPage = () => (
    <Container fluid>
        <Container>
            <Menu stackable>
                    <Menu.Item as={NavLink} exact={true} to={Routes.POLAR_ALIGNMENT_DARV} >DARV - Drift Alignment</Menu.Item>
                    <Menu.Item as={NavLink} exact={true} to={Routes.POLAR_ALIGNMENT_PLATESOLVING} >Platesolving Polar Alignment</Menu.Item>
            </Menu>
        </Container>
        <Divider hidden />
        <Container fluid>
            <HistoryLandingContainer route={Routes.POLAR_ALIGNMENT_PAGE} defaultLandingPath={Routes.POLAR_ALIGNMENT_DARV}>
                <Route path={Routes.POLAR_ALIGNMENT_DARV} exact={true} render={props => <DARV section={DARV_PAGE} {...props} />} />
                <Route path={Routes.POLAR_ALIGNMENT_PLATESOLVING} exact={true} render={props => <PlatesolvingPolarAlignment {...props} section={POLAR_PLATESOLVING} />} />
            </HistoryLandingContainer>
        </Container>
    </Container>
);


