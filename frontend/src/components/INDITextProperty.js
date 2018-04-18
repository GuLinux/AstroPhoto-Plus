import React from 'react';
import CommitPendingValuesButton from './CommitPendingValuesButton'
import INDILight from './INDILight'

const editableInput = (name, value, onChange) => (
    <div className="col-xs-5">
        <input
            type="text"
            className="col-xs-12"
            name={name}
            value={value}
            onChange={e => onChange(e.target.value)}
            />
    </div>

)


const INDITextProperty = ({device, property, isWriteable, pendingValues, displayValues, addPendingValues, commitPendingValues }) => (
    <div className="row">
        <div className="col-xs-1"><INDILight state={property.state} /></div> 
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-8">
            {property.values.map(value => (
                <div className="row" key={value.name} >
                    <div className="col-xs-2"><p>{value.label}</p></div>
                    <div className={isWriteable ? 'col-xs-5' : 'col-xs-10'}>
                                <input
                                    type="text"
                                    className="col-xs-12"
                                    name={'display_' + value.name} 
                                    value={value.value}
                                    readOnly={true}
                                    disabled={true}
                                    />
                    </div>
                    { isWriteable ? editableInput(value.name, displayValues[value.name], text => addPendingValues({ [value.name]: text})) : null }
                </div> 
            ))}
        </div>
        <div className="col-xs-1"><CommitPendingValuesButton bsStyle="primary" size="xsmall" isWriteable={isWriteable} commitPendingValues={commitPendingValues} /></div>
    </div>
)
 
export default INDITextProperty
