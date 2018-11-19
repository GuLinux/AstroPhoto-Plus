import { connect } from 'react-redux';
import { PlateSolvingPage, PlateSolvingSectionMenu } from './PlateSolvingPage';
import Actions from '../actions';
import { plateSolvingContainerSelector } from './selectors';

const mapDispatchToProps = dispatch => ({
  setOption: (option, value) => dispatch(Actions.PlateSolving.setOption(option, value)),
  solveField: options => dispatch(Actions.PlateSolving.solveField(options)),
})

export const PlateSolvingContainer = connect(
  plateSolvingContainerSelector,
  mapDispatchToProps
)(PlateSolvingPage)

export const PlateSolvingSectionMenuContainer = connect(
  null,
  mapDispatchToProps
)(PlateSolvingSectionMenu)


