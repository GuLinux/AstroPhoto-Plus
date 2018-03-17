export const displayValue = (value, pendingProperties) => {
    return [...pendingProperties.filter(p => p.valueName === value.name).map(p => p.newValue), value.value][0]
}

export const pendingProperty = (property, value, newValue) => ({ device: property.device, group: property.group, name: property.name, valueName: value.name, currentValue: value.value, newValue});
