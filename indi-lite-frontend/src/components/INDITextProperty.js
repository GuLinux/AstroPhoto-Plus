import React from 'react';

const INDITextProperty = ({property}) => (
    <div className="row">
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-10">
            {property.values.map(value => (
                <div className="row" key={value.name} >
                    <div className="col-xs-2"><p>{value.label}</p></div>
                    <input className="col-xs-10" type="text" name={value.name} value={value.value} />
                </div> 
            ))}
        </div>
    </div>
)
 
export default INDITextProperty
