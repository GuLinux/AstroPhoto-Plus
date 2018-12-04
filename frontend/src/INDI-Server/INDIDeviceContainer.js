import { connect } from 'react-redux'
import { INDIDevicePage } from './INDIDevicePage'
import { getVisibleGroups, getMessages } from './selectors';


const mapStateToProps = (state, ownProps) => {
    let device = ownProps.device in state.indiserver.deviceEntities ? ownProps.device : null;
    let groups = getVisibleGroups(state, ownProps);
    return {
        device,
        groups,
        messages: getMessages(state)[device],
    }
}

export const INDIDeviceContainer = connect(
  mapStateToProps,
  null,
)(INDIDevicePage)

