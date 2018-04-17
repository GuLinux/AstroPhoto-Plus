import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import ModalContainer from '../containers/ModalContainer'

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

    onTypeChanged(e) {
        this.setState({...this.state, type: e.target.value, typeValid: e.target.value !== 'none'});
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
                <form>
                  <div className="form-group">
                    <label htmlFor="item-type">Sequence item type</label>
                    <select className="form-control" id="item-type" onChange={this.onTypeChanged}>
                        <option value="none">--- Select type</option>
                        <option value="shots">Exposures sequence</option>
                        <option value="filter">Filter wheel</option>
                        <option value="property">Change INDI property</option>
                        <option value="command">Run command</option>
                    </select>
                  </div>
                </form>
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
