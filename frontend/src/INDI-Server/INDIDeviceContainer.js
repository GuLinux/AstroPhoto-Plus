import { connect } from 'react-redux'
import INDIDevicePage from './INDIDevicePage'
import Actions from '../actions'
import { getVisibleGroups } from './selectors';


const mapStateToProps = (state, ownProps) => {
    let device = ownProps.device;
    let groups = getVisibleGroups(state);
    let defaultGroup = groups.length > 0 ? groups[0]: '';
    return {
        device,
        groups,
        indiGroupTab: groups.includes(state.navigation.indi.group) ? state.navigation.indi.group : defaultGroup,
        messages: state.indiserver.messages.filter(m => m.device === device),
    }
}

const mapDispatchToProps = dispatch => ({
    navigateToDeviceGroup: (device, group) => dispatch(Actions.Navigation.toINDIGroup(device, group)),
})

const INDIDeviceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIDevicePage)

export default INDIDeviceContainer 

