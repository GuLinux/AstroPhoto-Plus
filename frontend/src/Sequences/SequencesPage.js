import React from 'react';
import { SequenceContainer } from './SequenceContainer';
import SequenceJobContainer from '../SequenceJobs/SequenceJobContainer';
import SequencesListContainer from './SequencesListContainer';
import { ImagesContainer } from '../SequenceJobs/ImagesContainer';
import { Route } from "react-router";
import { Routes } from '../routes';
import { Container } from 'semantic-ui-react'
import { HistoryLandingContainer } from '../Navigation/HistoryLandingContainer';

const SequencesPage = () => (
    <Container>
        <HistoryLandingContainer route={Routes.SEQUENCES_PAGE} defaultLandingPath={Routes.SEQUENCES_LIST}>
            <Route path={Routes.SEQUENCES_LIST} exact={true} component={SequencesListContainer} />
            <Route path={Routes.SEQUENCE_PAGE.route} exact={true} render={
                ({match}) => <SequenceContainer sequenceId={match.params.id} />
            } />
            <Route path={Routes.SEQUENCE_JOB_PAGE} exact={true} render={
                ({match}) => <SequenceJobContainer sequenceJobId={match.params.itemId} sequenceId={match.params.id} />
            } />

            <Route path={Routes.SEQUENCE_JOB_IMAGES} exact={true} render={
                ({match}) => <ImagesContainer sequenceJob={match.params.itemId} />
            } />
        </HistoryLandingContainer>
    </Container>
)
export default SequencesPage;
