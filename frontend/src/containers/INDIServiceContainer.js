import { connect } from 'react-redux'
import INDIServicePage from '../components/INDIServicePage'
import Actions from '../actions'


const mapStateToProps = (state, ownProps) => ({ ...state.indiservice })

const mapDispatchToProps = dispatch => ({ })

const INDIServiceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIServicePage)

export default INDIServiceContainer
