import React from 'react'
import { Modal } from 'react-bootstrap'
import ModalContainer from '../containers/ModalContainer'
import CheckableItem from './CheckableItem'

const initialState = {
    type: '',
    typeValid: false
}

class AddSequenceItemModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onTypeChanged= this.onTypeChanged.bind(this);
        this.onAddClicked = this.onAddClicked.bind(this);
    }

    onTypeChanged(type) {
        this.setState({...this.state, type, typeValid: type !== ''});
    }

    onAddClicked() {
        this.props.onAddSequenceItem(this.state.type)
        this.setState(initialState);
    }

    render() {
        return (
            <div>
            <Modal.Header>
              <Modal.Title>Add new Sequence</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span>Sequence item type</span>
                    <p><CheckableItem bsSize="large" checked={this.state.type === 'shots'} onChange={(type) => this.onTypeChanged(type)} name="shots">Exposures sequence</CheckableItem></p>
                    <p><CheckableItem bsSize="large" checked={this.state.type === 'filter'} onChange={(type) => this.onTypeChanged(type)} name="filter">Filter wheel</CheckableItem></p>
                    <p><CheckableItem bsSize="large" checked={this.state.type === 'property'} onChange={(type) => this.onTypeChanged(type)} name="property">Change INDI property</CheckableItem></p>
                    <p><CheckableItem bsSize="large" checked={this.state.type === 'command'} onChange={(type) => this.onTypeChanged(type)} name="command">Run command</CheckableItem></p>
            </Modal.Body>
            <Modal.Footer>
                <ModalContainer.Close modal={this.props.modalName}>Close</ModalContainer.Close>
                <ModalContainer.Close modal={this.props.modalName} bsStyle="primary" disabled={!this.state.typeValid} afterToggle={() => this.onAddClicked()}>Add</ModalContainer.Close>
            </Modal.Footer>
          </div>
        )
    }
}

export default AddSequenceItemModal;
