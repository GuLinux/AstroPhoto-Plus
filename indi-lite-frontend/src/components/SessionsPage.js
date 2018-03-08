import AddSession from '../components/AddSession';
import React from 'react';
import PagesListController from '../containers/PagesListController';
import SessionController from '../containers/SessionController';
import SessionsList from './SessionsList'

const SessionsPage = ({sessions, onSessionEdit, onAddSession, onSessionDelete}) => 
(
    <div className="sessions container">
        <PagesListController navigationKey="sessionPage">
            <div key="sessions">
                <SessionsList sessions={sessions} onSessionEdit={onSessionEdit} onSessionDelete={onSessionDelete} />
                <AddSession onAddSession={onAddSession} />
            </div>
            <SessionController key="session" />
        </PagesListController>
    </div>
)

export default SessionsPage;


