import React from 'react';
import { Select } from 'semantic-ui-react';

export const SelectFilter = ({filterWheel, availableFilters, currentFilter, onFilterSelected, filterWheelEntity, filterSlotProperty, isPending, ...rest}) => (
    <Select
        placeholder='Select a filter'
        value={filterWheel.currentFilter.number}
        icon={ isPending && { loading: true, name: 'spinner' }}
        options={
            filterWheel.filters.map(f => ({ text: f.name, value: f.number }))
        }
        onChange={(e, data) => onFilterSelected(data.value, filterWheel, filterWheel.filterSlotProperty) }
        {...rest}
     />

)

export default SelectFilter;
