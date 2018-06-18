import React from 'react';
import { Select } from 'semantic-ui-react';

export const SelectFilter = ({availableFilters, currentFilter, onFilterSelected, filterWheelEntity, filterSlotProperty, isPending}) => (
    <Select placeholder='Select a filter' value={currentFilter.number} basic size='tiny' labeled floating icon={ isPending ? { loading: true, name: 'spinner' } : null} options={
        availableFilters.map(f => ({ text: f.name, value: f.number }))
    }
        onChange={(e, data) => onFilterSelected(data.value, filterWheelEntity.device, filterSlotProperty) }
     />

)

export default SelectFilter;
