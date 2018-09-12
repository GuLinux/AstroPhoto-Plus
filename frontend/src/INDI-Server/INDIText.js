import React from 'react';
import { Input } from 'semantic-ui-react'

const EditableInput = ({value, onChange, ...args}) => (
    <Input
        type="text"
        className='indi-text'
        value={value}
        onChange={e => onChange(e.target.value)}
        size='small'
        {...args}
    />
)

const CurrentValue = ({value, ...args}) => (
    <Input
        type="text"
        className='indi-text'
        value={value}
        readOnly={true}
        disabled={false}
        size='small'
        {...args}
    />
)

const INDIText = ({value, editMode, displayValue, addPendingValues}) => {
    const onChange = text => addPendingValues({ [value.name]: text})
    if(editMode)
        return <EditableInput label={value.label} value={displayValue} onChange={onChange} fluid />
    return <CurrentValue label={value.label} value={value.value} fluid />
}


export default INDIText
