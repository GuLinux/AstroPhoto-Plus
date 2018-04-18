import React from 'react';

const editableInput = (name, value, onChange, fullWidth) => (
    <div className={ fullWidth ? 'col-xs-10' : 'col-xs-5'}>
        <input
            type="text"
            className="col-xs-12"
            name={name}
            value={value}
            onChange={e => onChange(e.target.value)}
            />
    </div>

)

const INDIText = ({value, isWriteable, displayValue, addPendingValues, hideCurrent}) => (
    <div className="row" key={value.name} >
        <div className="col-xs-2"><p>{value.label}</p></div>
        { hideCurrent ? null : (
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
        )}
        { isWriteable ? editableInput(value.name, displayValue, text => addPendingValues({ [value.name]: text}), hideCurrent) : null }
    </div> 
)


export default INDIText

