import { connect } from 'react-redux';
import { PlateSolving } from './PlateSolving';
import Actions from '../actions';
import { plateSolvingContainerSelector } from './selectors';

const mapDispatchToProps = {
  setOption: Actions.PlateSolving.setOption,
  solveField: Actions.PlateSolving.solveField,
  abortSolveField: Actions.PlateSolving.abortSolveField,
  addTargetObject: Actions.PlateSolving.addTargetObject,
  setMainTarget: Actions.PlateSolving.setMainTarget,
  removeTarget: Actions.PlateSolving.removeTarget,
}

export const PlateSolvingContainer = connect(
  plateSolvingContainerSelector,
  mapDispatchToProps
)(PlateSolving)


