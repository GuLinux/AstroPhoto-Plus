import React from 'react';
import { Modal, Form, Message } from 'semantic-ui-react';
import { sanitizePath } from '../utils';
import { ModalDialog } from '../Modals/ModalDialog';

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
        if(this.props.sequence) {
            let { camera, directory, filterWheel, name } = props.sequence;
            this.state = { camera, directory, filterWheel, name };
        }
    }

    onNameChanged(name) {
        this.setState({...this.state, name, directory: sanitizePath(name) });
    }

    onDirectoryChanged(directory) {
        this.setState({...this.state, directory: sanitizePath(directory) });
    }


    onPrimaryCameraChanged(camera) {
        this.setState({...this.state, camera, });
    }

    onFilterWheelChanged(filterWheel) {
        this.setState({...this.state, filterWheel});
    }

    onAddClicked() {
        if(this.props.sequence) {
            this.props.onEditSequence(this.props.sequence.id, this.state.name, this.state.directory, this.state.camera, this.state.filterWheel !== 'none' ? this.state.filterWheel : null)
        } else {
            this.props.onAddSequence(this.state.name, this.state.directory, this.state.camera, this.state.filterWheel !== 'none' ? this.state.filterWheel : null)
        }
        this.setState(initialState);
    }

    isValid() {
        const nameValid = this.state.name !== '';
        const directoryValid = this.state.directory !== '';
        const cameraValid = this.state.camera && this.state.camera !== 'none';
        return nameValid && directoryValid && cameraValid;
    }

    render() {
        return (
            <ModalDialog trigger={this.props.trigger} centered={false} basic size='small'>
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
                            options={this.props.cameras.map(c => ({ key: c.id, text: c.name, value: c.id }) )}
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
                                    ...this.props.filterWheels.map(f => ({ key: f.id, text: f.name, value: f.id }) )
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
                <ModalDialog.CloseButton content='Close' />
                <ModalDialog.CloseButton content={this.props.sequence ? 'Edit' : 'Add'} primary disabled={!this.isValid()} onClose={() => this.onAddClicked()} />
            </Modal.Actions>
          </ModalDialog>
        )
    }
}


export default AddSequenceModal;
