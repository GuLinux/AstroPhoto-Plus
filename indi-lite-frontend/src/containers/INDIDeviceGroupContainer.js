import { connect } from 'react-redux'
import INDIDeviceGroup from '../components/INDIDeviceGroup'
import Actions from '../actions'
import { makeGetDeviceProperties } from '../selectors/indi-properties';


const makeMapStateToProps = () => {
    const getDeviceProperties = makeGetDeviceProperties();
    const mapStateToProps = (state, ownProps) => {
        let device = state.indiserver.deviceEntities[ownProps.device];
        let group = ownProps.group;
        return {
            group,
            properties: getDeviceProperties(state, ownProps)
        }
    }
    return mapStateToProps;
}


const INDIDeviceGroupContainer = connect(
  makeMapStateToProps,
)(INDIDeviceGroup)

export default INDIDeviceGroupContainer 

