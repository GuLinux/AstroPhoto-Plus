import { connect } from 'react-redux';
import { PlateSolvingPage, PlateSolvingSectionMenu } from './PlateSolvingPage';
import { plateSolvingPageContainerSelector, plateSolvingSectionMenuSelector } from './selectors';
import { solveField } from './actions';

export const PlateSolvingPageContainer = connect(
  plateSolvingPageContainerSelector,
  null,
)(PlateSolvingPage)

export const PlateSolvingSectionMenuContainer = connect(
  plateSolvingSectionMenuSelector,
  { solveField }, 
)(PlateSolvingSectionMenu)


