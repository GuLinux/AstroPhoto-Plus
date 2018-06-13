import { connect } from 'react-redux'
import INDIDevicePage from './INDIDevicePage'
import { getVisibleGroups } from './selectors';


const mapStateToProps = (state, ownProps) => {
    let device = ownProps.device in state.indiserver.deviceEntities ? ownProps.device : null;
    let groups = getVisibleGroups(state, ownProps);
    return {
        device,
        groups,
        messages: state.indiserver.messages.filter(m => m.device === device),
    }
}

const mapDispatchToProps = dispatch => ({})

const INDIDeviceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIDevicePage)

export default INDIDeviceContainer
