import { connect } from 'react-redux';
import { PlateSolving } from './PlateSolving';
import Actions from '../actions';
import { plateSolvingContainerSelector } from './selectors';

const mapDispatchToProps = {
  setOption: Actions.PlateSolving.setOption,
  solveField: Actions.PlateSolving.solveField,
}

export const PlateSolvingContainer = connect(
  plateSolvingContainerSelector,
  mapDispatchToProps
)(PlateSolving)


