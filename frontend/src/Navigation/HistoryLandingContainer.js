import { connect } from 'react-redux';
import { HistoryLandingPage } from './HistoryLandingPage';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => ({
    landingPath: state.navigation.landingPaths[ownProps.route] || ownProps.defaultLandingPath,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setLandingPath: (path) => dispatch(Actions.Navigation.setLandingPath(ownProps.route, path)),
});


export const HistoryLandingContainer = connect(mapStateToProps, mapDispatchToProps)(HistoryLandingPage);

