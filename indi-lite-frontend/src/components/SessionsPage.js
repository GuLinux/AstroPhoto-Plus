import AddSession from '../components/AddSession';
import React from 'react';
import PagesListContainer from '../containers/PagesListContainer';
import SessionContainer from '../containers/SessionContainer';
import SessionsList from './SessionsList'

const SessionsPage = ({sessions, onSessionEdit, onAddSession}) => 
(
    <div className="sessions container">
        <PagesListContainer navigationKey="sessionPage">
            <div key="sessions">
                <SessionsList sessions={sessions} onSessionEdit={onSessionEdit} />
                <AddSession onAddSession={onAddSession} />
            </div>
            <SessionContainer key="session" />
        </PagesListContainer>
    </div>
)

export default SessionsPage;


