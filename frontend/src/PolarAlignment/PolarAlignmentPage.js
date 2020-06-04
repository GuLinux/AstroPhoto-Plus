import React from 'react';
import { DARV } from './DARV';
import { PlateSolvingDrift } from './PlatesolvingDrift';
import { Routes } from '../routes';
import { Divider, Container, Menu} from 'semantic-ui-react';
import { Route } from 'react-router';
import { NavLink } from 'react-router-dom';
import { HistoryLandingContainer } from '../Navigation/HistoryLandingContainer';
import { DARV_PAGE, POLAR_DRIFT } from '../Camera/sections';

export const PolarAlignmentPage = () => (
    <Container fluid>
        <Container>
            <Menu stackable>
                    <Menu.Item as={NavLink} exact={true} to={Routes.POLAR_ALIGNMENT_DARV} >DARV - Drift Alignment</Menu.Item>
                    <Menu.Item as={NavLink} exact={true} to={Routes.POLAR_ALIGNMENT_PLATESOLVING_DRIFT} >Drift Alignment with Platesolving</Menu.Item>
            </Menu>
        </Container>
        <Divider hidden />
        <Container fluid>
            <HistoryLandingContainer route={Routes.POLAR_ALIGNMENT_PAGE} defaultLandingPath={Routes.POLAR_ALIGNMENT_DARV}>
                <Route path={Routes.POLAR_ALIGNMENT_DARV} exact={true} render={props => <DARV section={DARV_PAGE} {...props} />} />
                <Route path={Routes.POLAR_ALIGNMENT_PLATESOLVING_DRIFT} exact={true} render={props => <PlateSolvingDrift {...props} section={POLAR_DRIFT} />} />
            </HistoryLandingContainer>
        </Container>
    </Container>
);


