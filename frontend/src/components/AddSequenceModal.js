import React from 'react'
import { Modal, Button, HelpBlock } from 'react-bootstrap'
import { sanitizePath } from '../utils'

const initialState = {
    name: '',
    nameValid: false,
    camera: '',
}


class AddSequenceModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    onNameChanged(name) {
        this.setState({...this.state, name: name, nameValid: name !== '', directory: sanitizePath(name), directoryValid: name !== '' });
    }

    onDirectoryChanged(directory) {
        this.setState({...this.state, directory: sanitizePath(directory), directoryValid: directory !== '' });
    }


    onPrimaryCameraChanged(camera) {
        this.setState({...this.state, camera, cameraValid: camera !== 'none'});
    }

    onAddClicked() {
        this.props.onAddSequence(this.state.name, this.state.directory, this.state.camera)
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
                        <label htmlFor="newSequenceName">Sequence name</label>
                        <input type="text" className="form-control" id="newSequenceName" placeholder="sequence name" onChange={e => this.onNameChanged(e.target.value)} value={this.state.name}/>
                        <HelpBlock>Friendly name to identify this sequence group.</HelpBlock>
                      </div>

                      <div className="form-group">
                        <label htmlFor="newSequenceDirectory">Sequence directory</label>
                        <input type="text" className="form-control" id="newSequenceDirectory" placeholder="sequence directory" onChange={e => this.onDirectoryChanged(e.target.value)} value={this.state.directory}/>
                        <HelpBlock>Main directory where images will be saved. This will be saved under the main StarQuew data directory configured on the server.</HelpBlock>
                      </div>

                      <div className="form-group">
                        <label htmlFor="primaryCamera">Primary camera</label>
                        <select className="form-control" id="primaryCamera" onChange={e => this.onPrimaryCameraChanged(e.target.value)}>
                            <option value="none">--- Select your camera</option>
                            {this.props.cameras.map(c => (
                            <option key={c.id} value={c.id}>{c.device.name}</option>
                        ))}
                        </select>
                        <HelpBlock>The selected camera will be used for all the shots in this sequence.</HelpBlock>
                      </div>
                    </form>
                </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.props.closeModal}>Close</Button>
              <Button bsStyle="primary" disabled={! (this.state.nameValid && this.state.directoryValid && this.state.cameraValid) } onClick={() => this.onAddClicked()}>Add</Button>
            </Modal.Footer>
          </div>
        )
    }
}

export default AddSequenceModal;
