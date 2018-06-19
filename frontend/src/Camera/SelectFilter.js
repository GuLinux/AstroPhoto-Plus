import React from 'react';
import { Select } from 'semantic-ui-react';

export const SelectFilter = ({availableFilters, currentFilter, onFilterSelected, filterWheelEntity, filterSlotProperty, isPending, ...rest}) => (
    <Select placeholder='Select a filter' value={currentFilter.number} icon={ isPending && { loading: true, name: 'spinner' }} options={
        availableFilters.map(f => ({ text: f.name, value: f.number }))
    }
        onChange={(e, data) => onFilterSelected(data.value, filterWheelEntity.device, filterSlotProperty) }
        {...rest}
     />

)

export default SelectFilter;
