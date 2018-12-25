export const getGroupId = property => `${property.device}/${property.group}`;
export const getValueId = (property, value) => `${property.device}/${property.name}/${value.name}`;
export const getPropertyId = (deviceName, propertyName) => `${deviceName}/${propertyName}`;

export const getPropertyName = id => id.split('/').slice(-1)[0];
export const getValueName = (id) => id.split('/').slice(-1)[0];

export const switchValues = (changedValue, property) => {
    if(property.rule !== 'ANY') {
        property.values.map(id => getValueName(id)).forEach(v => {
            if(!Object.keys(changedValue).includes(v)) {
                changedValue[v] = false;
            }
        });
    }
    return changedValue;
}