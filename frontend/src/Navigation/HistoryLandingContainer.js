import { connect } from 'react-redux';
import { HistoryLandingPage } from './HistoryLandingPage';
import { makeHistoryLandingSelector } from './selectors';
import Actions from '../actions';

const mapDispatchToProps = {
    setLandingPath: Actions.Navigation.setLandingPath,
};


export const HistoryLandingContainer = connect(makeHistoryLandingSelector, mapDispatchToProps)(HistoryLandingPage);

