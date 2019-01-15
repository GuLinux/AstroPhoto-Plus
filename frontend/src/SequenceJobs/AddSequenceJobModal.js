import React from 'react'
import { Modal, Menu, Header } from 'semantic-ui-react'
import { ModalDialog } from '../Modals/ModalDialog'

export class AddSequenceJobModal extends React.Component {

    addShotsSequenceJob = () => this.props.onAddSequenceJob('shots');
    addFilterWheelSequenceJob = () => this.props.onAddSequenceJob('filter');
    addINDIPropertySequenceJob = () => this.props.onAddSequenceJob('property');
    addCommandSequenceJob = () => this.props.onAddSequenceJob('command');
    addPauseSequenceJob = () => this.props.onAddSequenceJob('pause');

    render = () => (
        <ModalDialog trigger={this.props.trigger} basic size='small' centered={false}>
            <Modal.Header>Add new job</Modal.Header>
            <Modal.Content>
                <Menu vertical fluid>
                    <Menu.Header>Sequence item type</Menu.Header>
                    <Menu.Item onClick={this.addShotsSequenceJob}>
                        <Header size='small'>Exposures sequence</Header>
                        <p>Add a sequence of shots using the primary camera</p>
                        </Menu.Item>
                    { this.props.hasFilterWheel && (
                        <Menu.Item onClick={this.addFilterWheelSequenceJob}>
                            <Header size='small'>Filter wheel</Header>
                            <p>Change the current filter on the filter wheel</p>
                        </Menu.Item>
                    )}
                    <Menu.Item onClick={this.addINDIPropertySequenceJob}>
                        <Header size='small'>Change INDI property</Header>
                        <p>You can use this for changing camera settings (gain, binning), telescope movements, any change to any INDI connected device</p>
                    </Menu.Item>
                    <Menu.Item onClick={this.addCommandSequenceJob}>
                        <Header size='small'>Run command</Header>
                        <p>Run arbitrary (shell) command on the server</p>
                    </Menu.Item>
                    <Menu.Item onClick={this.addPauseSequenceJob}>
                        <Header size='small'>Pause sequence</Header>
                        <p>Pause the sequence for a predefined amount of time, or until the user chooses to resume.</p>
                    </Menu.Item>
                </Menu>
            </Modal.Content>
            <Modal.Actions>
                <ModalDialog.CloseButton content='Close' />
            </Modal.Actions>
      </ModalDialog>
    )
}


