import React from 'react';
import { connect } from 'react-redux';
import { indiPropertySequenceJobGroupItemSelector, indiPropertySequenceJobPropertyItemSelector } from '../selectors';
import { Menu } from 'semantic-ui-react';

class INDIPropertySequenceJobMenuItem extends React.PureComponent {
    render = () => (
        <Menu.Item
            active={this.props.active}
            key={this.props.id}
            onClick={this.onSelected}
        >
            {this.props.label}
        </Menu.Item>
    )
    onSelected = () => this.props.onSelected(this.props.id);
}

export const INDIPropertySequenceJobGroupItemContainer = connect(indiPropertySequenceJobGroupItemSelector)(INDIPropertySequenceJobMenuItem);
export const INDIPropertySequenceJobPropertyItemContainer = connect(indiPropertySequenceJobPropertyItemSelector)(INDIPropertySequenceJobMenuItem);
