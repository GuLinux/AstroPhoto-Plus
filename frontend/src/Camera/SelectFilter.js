import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { FilterSelectionContainer } from './FilterSelectionContainer';


export class SelectFilter extends React.Component {
    renderFilter = (id, index) => <FilterSelectionContainer onClick={this.onChange} filterWheelId={this.props.filterWheelId} key={id} filterNumber={index+1} />;

    onChange = (e,{value}) => this.props.onFilterSelected(value);

    render = () => {
        const {currentFilter, currentFilterName, availableFilters, isPending} = this.props;
        return (
           <Dropdown 
               size='tiny'
               floating
               button
               fluid
               compact
               text={'Filter: ' + currentFilterName}
               value={currentFilter}
               icon={ isPending && { loading: true, name: 'spinner' }}
            >
               <Dropdown.Menu>
                   {availableFilters.map(this.renderFilter)}
               </Dropdown.Menu>
            </Dropdown>
       
       );
    }
}
