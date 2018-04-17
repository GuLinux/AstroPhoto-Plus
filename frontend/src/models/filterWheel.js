// TODO: selector?

export const currentFilterProperty = (state, deviceID) => {
        let filterWheel = state.indiserver.deviceEntities[deviceID];
        return Object.keys(state.indiserver.properties).map(key => state.indiserver.properties[key]).find(p => p.device === filterWheel.id && p.name === 'FILTER_SLOT');
}

export const filterNamesProperty = (state, deviceID) => {
        let filterWheel = state.indiserver.deviceEntities[deviceID];
        return Object.keys(state.indiserver.properties).map(key => state.indiserver.properties[key]).find(p => p.device === filterWheel.id && p.name === 'FILTER_NAME');
}

export const currentFilterNumber = (state, deviceID) => currentFilterProperty(state, deviceID).values.find(p => p.name === 'FILTER_SLOT_VALUE').value

export const filtersMap = (state, deviceID) => filterNamesProperty(state, deviceID).values.map( (v, index) => ({ number: index+1, name: v.value }))
