import React from 'react'
import AddSequenceItemModal from './AddSequenceItemModal'
import SequenceItemsContainer from '../containers/SequenceItemsContainer';
import { Button, ButtonGroup } from 'react-bootstrap';

class Sequence extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showNewSequenceItemModal: false };
    }

    render() {
        if(this.props.sequence === null)
            return null;
        return (
        <div>
            <h2>
                {this.props.sequence.name}
                <ButtonGroup className="pull-right">
                    <Button onClick={this.props.navigateBack} bsSize="xsmall">back</Button>
                    <Button bsStyle="primary" bsSize="xsmall" className="pull-right" onClick={() => this.setState({...this.state, showNewSequenceItemModal: true })}>new</Button>
                </ButtonGroup>
            </h2>
            <AddSequenceItemModal show={this.state.showNewSequenceItemModal} onAddSequenceItem={(type) => this.props.onCreateSequenceItem(type, this.props.sequence.id)} closeModal={() => this.setState({...this.state, showNewSequenceItemModal: false})} />
            <SequenceItemsContainer sequenceId={this.props.sequence.id} />
        </div>
    )}

}

export default Sequence
