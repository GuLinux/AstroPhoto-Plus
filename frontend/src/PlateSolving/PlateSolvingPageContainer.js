import { connect } from 'react-redux';
import { PlateSolvingPage, PlateSolvingSectionMenu } from './PlateSolvingPage';
import { plateSolvingPageContainerSelector, plateSolvingSectionMenuSelector } from './selectors';

export const PlateSolvingPageContainer = connect(
  plateSolvingPageContainerSelector,
  null,
)(PlateSolvingPage)

export const PlateSolvingSectionMenuContainer = connect(
  plateSolvingSectionMenuSelector,
  null, 
)(PlateSolvingSectionMenu)


