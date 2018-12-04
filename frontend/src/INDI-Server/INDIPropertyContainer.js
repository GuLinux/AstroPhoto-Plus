import { connect } from 'react-redux'
import INDISwitchProperty from './INDISwitchProperty'
import INDILightProperty from './INDILightProperty'
import { INDINumberProperty, INDITextProperty } from './INDIInputProperty'
import Actions from '../actions'
import { indiPropertySelector } from './selectors';


export const displayValue = (value, pendingValues) => {
    return [...pendingValues.filter(p => p.valueName === value.name).map(p => p.newValue), value.value][0]
}

export const pendingProperty = (property, value, newValue) => ({valueName: value.name, currentValue: value.value, newValue});



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

export const INDILightPropertyContainer  = connect(indiPropertySelector, mapDispatchToProps, mergeProps)(INDILightProperty)
export const INDISwitchPropertyContainer = connect(indiPropertySelector, mapDispatchToProps, mergeProps)(INDISwitchProperty)
export const INDINumberPropertyContainer = connect(indiPropertySelector, mapDispatchToProps, mergeProps)(INDINumberProperty)
export const INDITextPropertyContainer   = connect(indiPropertySelector, mapDispatchToProps, mergeProps)(INDITextProperty)


