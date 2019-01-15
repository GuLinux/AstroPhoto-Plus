import React from 'react';
import { SequenceJobButtonsContainer } from '../SequenceJobButtonsContainer';
import { Form, Divider } from 'semantic-ui-react';
import { FilterSequenceJobItemContainer } from './FilterSequenceJobItemContainer';
import { get } from 'lodash';
import { NotFoundPage } from '../../components/NotFoundPage';

const DEFAULT_FILTER_NUMBER = 1;
export class FilterSequenceJob extends React.Component {
    constructor(props) {
        super(props)
        this.state = { sequenceJob: { filterNumber: DEFAULT_FILTER_NUMBER, ...props.sequenceJob} }
    }

    onFilterSelected = (number) => this.setState({...this.state, sequenceJob: {...this.state.sequenceJob, filterNumber: parseInt(number, 10)}});

    isValid = () => this.state.filterNumber > 0
    isChanged = () => get(this.state, 'sequenceJob.filterNumber', DEFAULT_FILTER_NUMBER) !== get(this.props, 'sequenceJob.filterNumber');

    renderFilter = (filterId) => <FilterSequenceJobItemContainer key={filterId} filterId={filterId} sequenceId={this.props.sequenceJob.sequence} onFilterSelected={this.onFilterSelected} selectedfilter={this.state.sequenceJob.filterNumber} />

    render = () => this.props.filters ? (
        <Form>
            <Form.Field>Set filter wheel position</Form.Field>
            {this.props.filters.map(this.renderFilter)}
            <Divider section />
            <SequenceJobButtonsContainer isValid={this.isValid} isChanged={this.isChanged()} sequenceJob={this.state.sequenceJob} />
        </Form>
    ) : <NotFoundPage />;
}

