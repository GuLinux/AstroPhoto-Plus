export const getGroupId = property => `${property.device}/${property.group}`;
export const getValueId = (property, value) => `${property.device}/${property.name}/${value.name}`;
export const getPropertyId = (deviceName, propertyName) => `${deviceName}/${propertyName}`;