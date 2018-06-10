import React from 'react'
import SequenceItemButtonsContainer from './SequenceItemButtonsContainer'
import { Form, Divider, Radio } from 'semantic-ui-react'

class FilterSequenceItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = { sequenceItem: { filterNumber: 1, ...props.sequenceItem} }
    }

    filterSelected(number) {
        this.setState({...this.state, sequenceItem: {...this.state.sequenceItem, filterNumber: parseInt(number, 10)}})
    }

    render() {
        return (
            <Form>
                <Form.Field>Set filter wheel position</Form.Field>
                {this.props.filters.map(filter => (
                <Form.Field>
                    <Radio
                        toggle
                        name='filterWheelValue'
                        label={`${filter.name} (${filter.number})`}
                        key={filter.number}
                        checked={this.state.sequenceItem.filterNumber === filter.number}
                        onChange={ e => this.filterSelected(filter.number) }
                        value={filter.number}
                    />
                </Form.Field>
                    ))}
                <Divider section />
                <SequenceItemButtonsContainer isValid={() => this.state.filterNumber > 0} isChanged={() => true} sequenceItem={this.state.sequenceItem} />
            </Form>
        )
    }
}

export default FilterSequenceItem;
