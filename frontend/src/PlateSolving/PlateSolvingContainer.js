import { connect } from 'react-redux';
import { PlateSolvingPage, PlateSolvingSectionMenu } from './PlateSolvingPage';
import {
  connectedAstrometrySelector,
  connectedTelescopesSelector,
  connectedCamerasSelector,
} from '../Gear/selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => ({
    astrometryDrivers: connectedAstrometrySelector(state),
    telescopes: connectedTelescopesSelector(state),
    cameras: connectedCamerasSelector(state),
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


