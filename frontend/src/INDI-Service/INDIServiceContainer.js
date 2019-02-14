import { connect } from 'react-redux'
import Actions from '../actions'
import INDIServicePage from './INDIServicePage'
import { indiServicePageSelector } from './selectors';

const mapDispatchToProps = {
    startService: Actions.INDIService.startService,
    stopService: Actions.INDIService.stopService,
    dismissError: Actions.INDIService.dismissError,
};

const INDIServiceContainer = connect(
  indiServicePageSelector,
  mapDispatchToProps,
)(INDIServicePage)

export default INDIServiceContainer
