import React from 'react';

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

const INDIText = ({value, isWriteable, displayValues, addPendingValues}) => (
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
)


export default INDIText

