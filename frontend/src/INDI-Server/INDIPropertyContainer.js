import { connect } from 'react-redux'
import { INDISwitchProperty } from './INDISwitchProperty'
import { INDILightProperty } from './INDILightProperty'
import { INDINumberProperty, INDITextProperty } from './INDIInputProperty'
import Actions from '../actions'
import { indiPropertySelector } from './selectors-redo';

const mapDispatchToProps = {
    setPropertyValues: Actions.INDIServer.setPropertyValues
};


export const INDILightPropertyContainer  = connect(indiPropertySelector, mapDispatchToProps)(INDILightProperty)
export const INDISwitchPropertyContainer = connect(indiPropertySelector, mapDispatchToProps)(INDISwitchProperty)
export const INDINumberPropertyContainer = connect(indiPropertySelector, mapDispatchToProps)(INDINumberProperty)
export const INDITextPropertyContainer   = connect(indiPropertySelector, mapDispatchToProps)(INDITextProperty)


