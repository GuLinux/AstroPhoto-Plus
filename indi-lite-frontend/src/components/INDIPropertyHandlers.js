export const displayValue = (value, pendingProperties) => {
    return [...pendingProperties.filter(p => p.valueName === value.name).map(p => p.newValue), value.value][0]
}

export const onChange = (property, value, newValue, addPendingProperty) => {
    addPendingProperty(property, value.name, value.value, newValue);
}
