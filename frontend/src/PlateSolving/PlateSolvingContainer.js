import { connect } from 'react-redux';
import { PlateSolvingPage } from './PlateSolvingPage';
import { getConnectedAstrometry, getConnectedAstrometryEntities } from '../Gear/selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => ({
    astrometryDrivers: getConnectedAstrometry(state),
    astrometryDriverEntities: getConnectedAstrometryEntities(state),
})

const mapDispatchToProps = dispatch => ({
})

export const PlateSolvingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlateSolvingPage)

