import React from 'react';
import SequenceContainer from './SequenceContainer';
import SequenceJobContainer from '../SequenceJobs/SequenceJobContainer';
import SequencesListContainer from './SequencesListContainer';
import ImagesContainer from '../SequenceJobs/ImagesContainer';
import { Route } from "react-router";
import { Container } from 'semantic-ui-react'
import { HistoryLandingContainer } from '../Navigation/HistoryLandingContainer';

const SequencesPage = () => (
    <Container>
        <HistoryLandingContainer route='/sequences' defaultLandingPath='/sequences/all'>
            <Route path="/sequences/all" exact={true} component={SequencesListContainer} />
            <Route path="/sequences/:id" exact={true} render={
                ({match}) => <SequenceContainer sequenceId={match.params.id} />
            } />
            <Route path="/sequences/:id/items/:itemId" exact={true} render={
                ({match}) => <SequenceJobContainer sequenceJobId={match.params.itemId} />
            } />

            <Route path="/sequences/:id/items/:itemId/images" exact={true} render={
                ({match}) => <ImagesContainer sequenceJob={match.params.itemId} />
            } />
        </HistoryLandingContainer>
    </Container>
)
export default SequencesPage;
