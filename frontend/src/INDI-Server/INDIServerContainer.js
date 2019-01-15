import { connect } from 'react-redux'
import INDIServerPage from './INDIServerPage'
import { indiServerContainerSelector } from './selectors';

const INDIServerContainer = connect(
  indiServerContainerSelector,
  null, 
)(INDIServerPage)

export default INDIServerContainer
