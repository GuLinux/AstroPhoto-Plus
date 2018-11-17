import { connect } from 'react-redux';
import { PlateSolvingPage, PlateSolvingSectionMenu } from './PlateSolvingPage';
import {
  connectedAstrometrySelector,
  connectedTelescopesSelector,
} from '../Gear/selectors';
import Actions from '../actions';

const mapStateToProps = (state, ownProps) => ({
    astrometryDrivers: connectedAstrometrySelector(state),
    telescopes: connectedTelescopesSelector(state),
    options: state.plateSolving.options,
})

const mapDispatchToProps = dispatch => ({
  setOption: (option, value) => dispatch(Actions.PlateSolving.setOption(option, value)),
})

export const PlateSolvingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlateSolvingPage)

export const PlateSolvingSectionMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlateSolvingSectionMenu)


