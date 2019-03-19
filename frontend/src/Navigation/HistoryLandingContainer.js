import { connect } from 'react-redux';
import { HistoryLandingPage } from './HistoryLandingPage';
import { historyLandingSelector } from './selectors';
import { setLandingPath } from './actions';
const mapDispatchToProps = {
    setLandingPath, 
};


export const HistoryLandingContainer = connect(historyLandingSelector, mapDispatchToProps)(HistoryLandingPage);

