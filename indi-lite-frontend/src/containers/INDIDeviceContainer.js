import { connect } from 'react-redux'
import INDIDevicePage from '../components/INDIDevicePage'
import Actions from '../actions'
import { makeGetDeviceGroups } from '../selectors/indi-groups';


const makeMapStateToProps = () => {
    const getDeviceGroups = makeGetDeviceGroups();
    const mapStateToProps = (state, ownProps) => {
        let device = ownProps.device;
        let groups = getDeviceGroups(state, ownProps);
        let defaultGroup = groups.length > 0 ? groups[0]: '';
        console.log(`device: ${device}, groups: ${groups}, defaultGroup: ${defaultGroup}, navigationGroup: ${state.navigation.indiGroup}, present: ${ groups.includes(state.navigation.indiGroup)}`);
        return {
            device,
            groups,
            indiGroupTab: groups.includes(state.navigation.indiGroup) ? state.navigation.indiGroup : defaultGroup,
            messages: state.indiserver.messages.filter(m => m.device == device),
        }
    }
    return mapStateToProps
}

const mapDispatchToProps = dispatch => ({
    navigateToDeviceGroup: (device, group) => dispatch(Actions.Navigation.toINDIGroup(device, group)),
})

const INDIDeviceContainer = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(INDIDevicePage)

export default INDIDeviceContainer 

