import AddSession from '../components/AddSession';
import React from 'react';
import PagesListContainer from '../containers/PagesListContainer';
import SessionContainer from '../containers/SessionContainer';
import SessionsList from './SessionsList'

const SessionsPage = ({sessions, onSessionEdit, onAddSession, onSessionDelete}) => 
(
    <div className="sessions container-fluid">
        <PagesListContainer navigationKey="sessionPage">
            <div key="sessions">
                <AddSession />
                <SessionsList sessions={sessions} onSessionEdit={onSessionEdit} onSessionDelete={onSessionDelete} />
            </div>
            <SessionContainer key="session" />
        </PagesListContainer>
    </div>
)

export default SessionsPage;


