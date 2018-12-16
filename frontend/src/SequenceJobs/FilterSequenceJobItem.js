import React from 'react';
import { Form, Radio } from 'semantic-ui-react';

export class FilterSequenceJobItem extends React.PureComponent {
    onFilterSelected = () => this.props.onFilterSelected(this.props.filterNumber);

    render = () => (
        <Form.Field>
            <Radio
                toggle
                name='filterWheelValue'
                label={`${this.props.filterName} (${this.props.filterNumber})`}
                key={this.props.filterNumber}
                checked={this.props.selectedfilter === this.props.filterNumber}
                onChange={this.onFilterSelected}
                value={this.props.filterNumber}
            />
        </Form.Field>
    )
}

