import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const initialState = {
    name: '',
    nameValid: false,
    camera: '',
}


class AddSequenceModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.onNameChanged = this.onNameChanged.bind(this);
        this.onPrimaryCameraChanged = this.onPrimaryCameraChanged.bind(this);
        this.onAddClicked = this.onAddClicked.bind(this);
    }

    onNameChanged(e) {
        this.setState({...this.state, name: e.target.value, nameValid: e.target.value !== ''});
    }

    onPrimaryCameraChanged(e) {
        this.setState({...this.state, camera: e.target.value, cameraValid: e.target.value !== 'none'});
    }

    onAddClicked() {
        this.props.onAddSequence(this.state.name, this.state.camera)
        this.setState(initialState);
        this.props.closeModal();
    }

    render() {
        return (
          <Modal show={this.props.show}>
            <Modal.Header>
              <Modal.Title>Add new Sequence</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <form>
                      <div className="form-group">
                        <label htmlFor="newSequenceName">Sequence name</label>
                        <input type="text" className="form-control" id="newSequenceName" placeholder="sequence name" onChange={this.onNameChanged} value={this.state.name}/>
                      </div>

                      <div className="form-group">
                        <label htmlFor="primaryCamera">Primary camera</label>
                        <select className="form-control" id="primaryCamera" onChange={this.onPrimaryCameraChanged}>
                            <option value="none">--- Select your camera</option>
                            {this.props.cameras.map(c => (
                            <option key={c.id} value={c.id}>{c.device.name}</option>
                        ))}
                        </select>
                      </div>
                    </form>
                </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.props.closeModal}>Close</Button>
              <Button bsStyle="primary" disabled={! (this.state.nameValid && this.state.cameraValid) } onClick={this.onAddClicked}>Add</Button>
            </Modal.Footer>
          </Modal>
        )
    }
}

export default AddSequenceModal;
