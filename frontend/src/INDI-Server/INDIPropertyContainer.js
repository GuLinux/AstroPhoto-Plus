import { connect } from 'react-redux'
import INDISwitchProperty from './INDISwitchProperty'
import INDILightProperty from './INDILightProperty'
import INDITextProperty from './INDITextProperty'
import INDINumberProperty from './INDINumberProperty'
import Actions from '../actions'


export const displayValue = (value, pendingValues) => {
    return [...pendingValues.filter(p => p.valueName === value.name).map(p => p.newValue), value.value][0]
}

export const pendingProperty = (property, value, newValue) => ({valueName: value.name, currentValue: value.value, newValue});



const mapStateToProps = (state, ownProps) => {
    let property = ownProps.property;
    let device = state.indiserver.deviceEntities[property.device];
    let pendingValues = property.id in state.indiserver.pendingValues ? state.indiserver.pendingValues[property.id] : {};
    let displayValues = property.values.reduce( (displayValues, value) => ({...displayValues, [value.name]: value.value}), {});
    Object.keys(pendingValues).forEach(name => displayValues[name] = pendingValues[name]);
    return {
        device,
        property,
        isWriteable: property.perm_write && property.state !== 'CHANGED_BUSY' && ! ownProps.readOnly,
        pendingValues,
        displayValues,
    }
}

const mapDispatchToProps = dispatch => ({
    addPendingValues: (device, property, pendingValues, autoApply) => dispatch(Actions.INDIServer.addPendingValues(device, property, pendingValues, autoApply)),
    commitPendingValues: (device, property, pendingValues) => dispatch(Actions.INDIServer.commitPendingValues(device, property, pendingValues)),
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...ownProps,
    addPendingValues: (pendingValues, autoApply) => dispatchProps.addPendingValues(stateProps.device, stateProps.property, pendingValues, autoApply),
    commitPendingValues: () => dispatchProps.commitPendingValues(stateProps.device, stateProps.property, stateProps.pendingValues),
})

export const INDILightPropertyContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(INDILightProperty)
export const INDISwitchPropertyContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(INDISwitchProperty)
export const INDINumberPropertyContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(INDINumberProperty)
export const INDITextPropertyContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(INDITextProperty)


