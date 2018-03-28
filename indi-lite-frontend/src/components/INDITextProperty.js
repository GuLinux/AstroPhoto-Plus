import React from 'react';
import CommitPendingValuesButton from './CommitPendingValuesButton'
import INDILight from './INDILight'
import { Form, FormGroup } from 'react-bootstrap';


const INDITextProperty = ({device, property, isWriteable, pendingValues, displayValues, addPendingValues, commitPendingValues }) => (
    <div className="row">
        <div className="col-xs-1"><INDILight state={property.state} /></div> 
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-8">
            {property.values.map(value => (
                <div className="row" key={value.name} >
                    <div className="col-xs-2"><p>{value.label}</p></div>
                    <div className="col-xs-10">
                        <Form inline>
                            <FormGroup controlId={'display_' + value.name}>
                                <input
                                    type="text"
                                    name={'display_' + value.name} 
                                    value={value.value}
                                    readOnly={true}
                                    disabled={true}
                                    />
                            </FormGroup>
                            <FormGroup controlId={'display_' + value.name}>
                                <input
                                    type="text"
                                    name={value.name}
                                    value={displayValues[value.name]}
                                    onChange={(numValue, stringValue) => addPendingValues(device, property, { [value.name]: numValue })}
                                    readOnly={!isWriteable}
                                    />
                            </FormGroup>
                        </Form>
                    </div>

                    <input
                        className="col-xs-10"
                        type="text"
                        name={value.name} 
                        value={displayValues[value.name]}
                        onChange={e => addPendingValues(device, property, { [value.name]: e.target.value })}
                        readOnly={!isWriteable}
                    />
                </div> 
            ))}
        </div>
        <div className="col-xs-1"><CommitPendingValuesButton bsStyle="primary" size="xsmall" device={device} isWriteable={isWriteable} pendingValues={pendingValues} commitPendingValues={commitPendingValues} property={property} /></div>
    </div>
)
 
export default INDITextProperty
