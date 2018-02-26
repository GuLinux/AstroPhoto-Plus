import VisibleSessions from '../containers/VisibleSessions';
import AddSession from '../containers/AddSession';
import React from 'react';
import PagesListContainer from '../containers/PagesListContainer';
import SessionContainer from '../containers/SessionContainer';

const SessionsPage = () => {
 return (
    <div className="sessions container">
        <PagesListContainer navigationKey="sessionPage">
            <div key="sessions">
                <VisibleSessions />
                <AddSession />
            </div>
            <SessionContainer key="session" />
        </PagesListContainer>
    </div>
)
}
export default SessionsPage;


