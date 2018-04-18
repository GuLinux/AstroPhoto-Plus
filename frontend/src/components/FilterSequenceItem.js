import React from 'react'
import SequenceItemButtonsContainer from '../containers/SequenceItemButtonsContainer'
import { FormGroup, Radio } from 'react-bootstrap'

class FilterSequenceItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = { sequenceItem: { filterNumber: 1, ...props.sequenceItem} }
    }

    filterSelected(number) {
        this.setState({...this.state, sequenceItem: {...this.state.sequenceItem, filterNumber: parseInt(number)}})
    }

    render() {
        return (
            <div>
                <h4>Set filter wheel position</h4>
                <FormGroup>
                    {this.props.filters.map(filter => (
                  <Radio
                        name="filterWheel"
                        key={filter.number}
                        checked={this.state.sequenceItem.filterNumber === filter.number}
                        onChange={ e => this.filterSelected(filter.number) }
                        value={filter.number}>
                            {filter.name} ({filter.number})
                        </Radio>
                    ))}
                </FormGroup>

                <SequenceItemButtonsContainer isValid={() => this.state.filterNumber > 0} isChanged={() => true} sequenceItem={this.state.sequenceItem} />
            </div>
        )
    }
}

export default FilterSequenceItem;
