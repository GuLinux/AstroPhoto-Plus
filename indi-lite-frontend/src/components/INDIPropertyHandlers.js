import { Button } from 'react-bootstrap'
import React from 'react';

export const displayValue = (value, pendingProperties) => {
    return [...pendingProperties.filter(p => p.valueName === value.name).map(p => p.newValue), value.value][0]
}

export const pendingProperty = (property, value, newValue) => ({ device: property.device, group: property.group, name: property.name, valueName: value.name, currentValue: value.value, newValue});

export const hasPendingProperties = (property, pendingProperties) => pendingProperties.filter(p => p.device === property.device && p.group === property.group && p.name === property.name).length > 0;

export const canUpdate = property => property.perm_write && property.state != 'busy';

export const CommitPendingPropertiesButton = ({property, pendingProperties, commitPendingProperties, bsStyle, size}) => {
    if(!property.perm_write)
        return null;
    return (
        <Button
            bsStyle={bsStyle}
            bsSize={size}
            disabled={!hasPendingProperties(property, pendingProperties)}
            onClick={e => commitPendingProperties(pendingProperties)}
            >set</Button>
    )
}
