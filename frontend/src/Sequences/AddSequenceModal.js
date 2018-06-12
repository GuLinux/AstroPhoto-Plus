import React from 'react'
import { Modal, Form, Message } from 'semantic-ui-react'
import { sanitizePath } from '../utils'
import ModalContainer from '../Modals/ModalContainer'

const initialState = {
    name: '',
    nameValid: false,
    camera: '',
    directory: '',
    filterWheel: 'none',
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
        console.log(camera);
        this.setState({...this.state, camera, cameraValid: camera !== 'none'});
    }

    onFilterWheelChanged(filterWheel) {
        this.setState({...this.state, filterWheel});
    }

    onAddClicked() {
        this.props.onAddSequence(this.state.name, this.state.directory, this.state.camera, this.state.filterWheel !== 'none' ? this.state.filterWheel : null)
        this.setState(initialState);
    }

    isValid() {
        return this.state.nameValid && this.state.directoryValid && this.state.cameraValid
    }

    // TODO: refactor to use common modal class
    render() {
        return (
            <ModalContainer centered={true} size='large' name={AddSequenceModal.NAME}>
                <Modal.Header>Add new Sequence</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input
                            label='Sequence name'
                            type='text'
                            id='newSequenceName'
                            onChange={e => this.onNameChanged(e.target.value)}
                            value={this.state.name}
                            placeholder='sequence name'
                        />
                        <Message info size='mini'>Friendly name to identify this sequence group.</Message>

                        <Form.Input
                            label='Sequence directory'
                            type='text'
                            id='newSequencePath'
                            onChange={e => this.onDirectoryChanged(e.target.value)}
                            value={this.state.directory}
                            placeholder='sequence directory'
                        />
                        <Message info size='mini'>
                            Main directory where images will be saved. This will be saved under the main StarQuew data directory configured on the server.
                        </Message>

                        <Form.Select
                            label='Primary camera'
                            id='newSequenceCamera'
                            placeholder='Select primary camera'
                            options={this.props.cameras.map(c => ({ key: c.id, text: c.device.name, value: c.id }) )}
                            onChange={(e, data) => this.onPrimaryCameraChanged(data.value) }
                            value={this.state.camera}
                        />
                        <Message info size='mini'>
                            The selected camera will be used for all the shots in this sequence.
                        </Message>

                        <Form.Select
                            label='Filter wheel'
                            id='newSequenceFilterWheel'
                            placeholder='Select filter wheel'
                            options={
                                [
                                    {key: 'none', text: 'None', value: 'none'},
                                    ...this.props.filterWheels.map(f => ({ key: f.id, text: f.device.name, value: f.id }) )
                                ]
                            }
                            onChange={(e, data) => this.onFilterWheelChanged(data.value) }
                            value={this.state.filterWheel}
                        />
                        <Message info size='mini'>
                            The selected filter wheel will be used for all the shots in this sequence.
                        </Message>
                    </Form>
            </Modal.Content>
            <Modal.Actions>
                <ModalContainer.Button.Close modal={AddSequenceModal.NAME}>Close</ModalContainer.Button.Close>
                <ModalContainer.Button.Close primary action='close' modal={AddSequenceModal.NAME} disabled={!this.isValid()} afterToggle={() => this.onAddClicked()}>Add</ModalContainer.Button.Close>
            </Modal.Actions>
          </ModalContainer>
        )
    }
}

AddSequenceModal.NAME = 'ADD_SEQUENCE_MODAL';

export default AddSequenceModal;
