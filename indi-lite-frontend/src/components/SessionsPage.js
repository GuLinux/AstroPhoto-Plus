import VisibleSessions from '../containers/VisibleSessions';
import AddSession from '../containers/AddSession';
import React from 'react';

const SessionsPage = () => {
 return (
    <div className="sessions container">
        <VisibleSessions />
        <AddSession />
    </div>
)
}
export default SessionsPage;


