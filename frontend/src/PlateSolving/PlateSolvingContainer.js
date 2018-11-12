import { connect } from 'react-redux';
import { PlateSolvingPage, PlateSolvingSectionMenu } from './PlateSolvingPage';
import {
  getConnectedAstrometry,
  getConnectedAstrometryEntities,
  getConnectedTelescopes,
  getConnectedTelescopeEntities
} from '../Gear/selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => ({
    astrometryDrivers: getConnectedAstrometry(state),
    astrometryDriverEntities: getConnectedAstrometryEntities(state),
    telescopes: getConnectedTelescopes(state),
    telescopeEntities: getConnectedTelescopeEntities(state),
})

const mapDispatchToProps = dispatch => ({
})

export const PlateSolvingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlateSolvingPage)

export const PlateSolvingSectionMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlateSolvingSectionMenu)


