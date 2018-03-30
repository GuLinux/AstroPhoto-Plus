import { connect } from 'react-redux'
import INDIDevicePage from '../components/INDIDevicePage'
import Actions from '../actions'


const mapStateToProps = (state, ownProps) => {
    let device = ownProps.device;
    let groups = device.groups.map(id => state.indiserver.groups[id]);
    let defaultGroup = groups.length > 0 ? groups[0].id : '';
    return {
        device: device.id,
        groups,
        indiGroupTab: state.navigation.indiGroup in state.indiserver.groups ? state.navigation.indiGroup : defaultGroup,
        messages: state.indiserver.messages.filter(m => m.device == device.id),
    }
}

const mapDispatchToProps = dispatch => ({
    navigateToDeviceGroup: (device, group) => dispatch(Actions.Navigation.toINDIGroup(device.id, group)),
})

const INDIDeviceContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(INDIDevicePage)

export default INDIDeviceContainer 

