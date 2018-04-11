import React from 'react'
import { Modal, Button } from 'react-bootstrap'

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
        this.props.closeModal();
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
                    </select>
                  </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.props.closeModal}>Close</Button>
              <Button bsStyle="primary" disabled={! (this.state.typeValid) } onClick={this.onAddClicked}>Add</Button>
            </Modal.Footer>
          </div>
        )
    }
}

export default AddSequenceItemModal;
