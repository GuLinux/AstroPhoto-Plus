import React from 'react'
import { FormGroup, Radio } from 'react-bootstrap'

class FilterSequenceItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = { number: 1, ...props.sequenceItem }
    }

    filterSelected(number) {
        this.setState({...this.state, number})
    }

    render() {
        return (
            <FormGroup onChange={(e) => this.filterSelected(e.target.value)}>
                {this.props.filters.map(filter => (
              <Radio name="filterWheel" key={filter.number} value={filter.number}>{filter.name} ({filter.number})</Radio>
                ))}
            </FormGroup>
        )
    }
}

export default FilterSequenceItem;
