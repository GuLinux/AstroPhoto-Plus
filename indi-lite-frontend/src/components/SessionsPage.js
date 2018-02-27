import AddSession from '../components/AddSession';
import React from 'react';
import PagesListController from '../containers/PagesListController';
import SessionContainer from '../containers/SessionContainer';
import SessionsList from './SessionsList'

const SessionsPage = ({sessions, onSessionEdit, onAddSession}) => 
(
    <div className="sessions container">
        <PagesListController navigationKey="sessionPage">
            <div key="sessions">
                <SessionsList sessions={sessions} onSessionEdit={onSessionEdit} />
                <AddSession onAddSession={onAddSession} />
            </div>
            <SessionContainer key="session" />
        </PagesListController>
    </div>
)

export default SessionsPage;


