import { connect } from 'react-redux'
import { INDISwitchProperty } from './INDISwitchProperty'
import { INDILightProperty } from './INDILightProperty'
import { INDINumberProperty, INDITextProperty } from './INDIInputProperty'
import Actions from '../actions'
import { indiPropertySelector } from './selectors';

const mapStateToProps = (state, props) => indiPropertySelector(props.propertyId)(state, props);

const mapDispatchToProps = {
    setPropertyValues: Actions.INDIServer.setPropertyValues
};


export const INDILightPropertyContainer  = connect(mapStateToProps, mapDispatchToProps)(INDILightProperty)
export const INDISwitchPropertyContainer = connect(mapStateToProps, mapDispatchToProps)(INDISwitchProperty)
export const INDINumberPropertyContainer = connect(mapStateToProps, mapDispatchToProps)(INDINumberProperty)
export const INDITextPropertyContainer   = connect(mapStateToProps, mapDispatchToProps)(INDITextProperty)


