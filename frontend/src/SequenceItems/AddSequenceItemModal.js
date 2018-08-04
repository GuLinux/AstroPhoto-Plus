import React from 'react'
import { Modal, Menu, Header } from 'semantic-ui-react'
import { ModalDialog } from '../Modals/ModalDialog'

const AddSequenceItemModal = ({onAddSequenceItem, trigger, hasFilterWheel}) => (
    <ModalDialog trigger={trigger} basic size='small' centered={false}>
        <Modal.Header>Add new sequence element</Modal.Header>
        <Modal.Content>
            <Menu vertical fluid>
                <Menu.Header>Sequence item type</Menu.Header>
                <Menu.Item onClick={() => onAddSequenceItem('shots')}>
                    <Header size='small'>Exposures sequence</Header>
                    <p>Add a sequence of shots using the primary camera</p>
                    </Menu.Item>
                { hasFilterWheel && (
                    <Menu.Item onClick={() => onAddSequenceItem('filter')}>
                        <Header size='small'>Filter wheel</Header>
                        <p>Change the current filter on the filter wheel</p>
                    </Menu.Item>
                )}
                <Menu.Item onClick={() => onAddSequenceItem('property')}>
                    <Header size='small'>Change INDI property</Header>
                    <p>You can use this for changing camera settings (gain, binning), telescope movements, any change to any INDI connected device</p>
                </Menu.Item>
                <Menu.Item onClick={() => onAddSequenceItem('command')}>
                    <Header size='small'>Run command</Header>
                    <p>Run arbitrary (shell) command on the server</p>
                </Menu.Item>
            </Menu>
        </Modal.Content>
        <Modal.Actions>
            <ModalDialog.CloseButton content='Close' />
        </Modal.Actions>
  </ModalDialog>
)

export default AddSequenceItemModal;

