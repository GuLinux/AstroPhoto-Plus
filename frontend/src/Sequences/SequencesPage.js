import React from 'react';
import SequenceContainer from './SequenceContainer';
import SequenceItemContainer from '../SequenceItems/SequenceItemContainer';
import SequencesListContainer from './SequencesListContainer';
import { Route } from "react-router";

const SequencesPage = () => (
    <div className="sequences container">
        <Route path="/sequences" exact={true} component={SequencesListContainer} />
        <Route path="/sequences/:id" exact={true} render={
            ({match}) => <SequenceContainer sequenceId={match.params.id} />
        } />
        <Route path="/sequences/:id/items/:itemId" render={
            ({match}) => <SequenceItemContainer sequenceItemId={match.params.itemId} />
        } />
    </div>
)
export default SequencesPage;
