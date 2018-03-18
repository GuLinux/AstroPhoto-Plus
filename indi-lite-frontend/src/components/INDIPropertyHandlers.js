import { Button } from 'react-bootstrap'
import React from 'react';

export const displayValue = (value, pendingProperties) => {
    return [...pendingProperties.filter(p => p.valueName === value.name).map(p => p.newValue), value.value][0]
}

export const pendingProperty = (property, value, newValue) => ({ device: property.device, group: property.group, name: property.name, valueName: value.name, currentValue: value.value, newValue});

export const hasPendingProperties = (property, pendingProperties) => pendingProperties.filter(p => p.device === property.device && p.group === property.group && p.name === property.name).length > 0;

export const CommitPendingPropertiesButton = ({property, pendingProperties, commitPendingProperties, style, size}) => (
    <Button
        bsStyle={style}
        bsSize={size}
        disabled={!hasPendingProperties(property, pendingProperties)}
        onClick={e => commitPendingProperties(pendingProperties)}
        >set</Button>
)
