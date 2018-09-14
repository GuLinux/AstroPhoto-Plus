import React from 'react'
import SequenceJobButtonsContainer from './SequenceJobButtonsContainer'
import { Form, Divider, Radio } from 'semantic-ui-react'

class FilterSequenceJob extends React.Component {
    constructor(props) {
        super(props)
        this.state = { sequenceJob: { filterNumber: 1, ...props.sequenceJob} }
    }

    filterSelected(number) {
        this.setState({...this.state, sequenceJob: {...this.state.sequenceJob, filterNumber: parseInt(number, 10)}})
    }

    render() {
        return (
            <Form>
                <Form.Field>Set filter wheel position</Form.Field>
                {this.props.filters.map(filter => (
                <Form.Field key={filter.number}>
                    <Radio
                        toggle
                        name='filterWheelValue'
                        label={`${filter.name} (${filter.number})`}
                        key={filter.number}
                        checked={this.state.sequenceJob.filterNumber === filter.number}
                        onChange={ e => this.filterSelected(filter.number) }
                        value={filter.number}
                    />
                </Form.Field>
                    ))}
                <Divider section />
                <SequenceJobButtonsContainer isValid={() => this.state.filterNumber > 0} isChanged={() => true} sequenceJob={this.state.sequenceJob} />
            </Form>
        )
    }
}

export default FilterSequenceJob;
