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

export const INDIText = ({value, editMode, displayValue, onChange}) => {
    if(editMode)
        return <EditableInput label={value.label} value={displayValue} onChange={onChange.bind(this, value.name)} fluid />
    return <CurrentValue label={value.label} value={value.value} fluid />
}


