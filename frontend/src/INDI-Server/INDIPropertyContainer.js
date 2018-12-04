import { connect } from 'react-redux'
import { INDISwitchProperty } from './INDISwitchProperty'
import { INDILightProperty } from './INDILightProperty'
import { INDINumberProperty, INDITextProperty } from './INDIInputProperty'
import Actions from '../actions'
import { indiPropertySelector } from './selectors';



const mapDispatchToProps = dispatch => ({
    setPropertyValues: (device, property, values) => dispatch(Actions.INDIServer.setPropertyValues(device, property, values)),
})

export const INDILightPropertyContainer  = connect(indiPropertySelector, mapDispatchToProps)(INDILightProperty)
export const INDISwitchPropertyContainer = connect(indiPropertySelector, mapDispatchToProps)(INDISwitchProperty)
export const INDINumberPropertyContainer = connect(indiPropertySelector, mapDispatchToProps)(INDINumberProperty)
export const INDITextPropertyContainer   = connect(indiPropertySelector, mapDispatchToProps)(INDITextProperty)


