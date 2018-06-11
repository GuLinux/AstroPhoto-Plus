import React from 'react'
import { Modal, Menu, Header } from 'semantic-ui-react'
import ModalContainer from '../Modals/ModalContainer'

// TODO: it might be better to move the redux code away from here
import { connect } from 'react-redux'
import Actions from '../actions'

const AddSequenceItemModal = ({onAddSequenceItem}) => (
    <ModalContainer name={AddSequenceItemModal.NAME}>
        <Modal.Header>Add new sequence element</Modal.Header>
        <Modal.Content>
            <Menu vertical fluid>
                <Menu.Header>Sequence item type</Menu.Header>
                <Menu.Item onClick={() => onAddSequenceItem('shots')}>
                    <Header size='small'>Exposures sequence</Header>
                    <p>Add a sequence of shots using the primary camera</p>
                    </Menu.Item>
                <Menu.Item onClick={() => onAddSequenceItem('filter')}>
                    <Header size='small'>Filter wheel</Header>
                    <p>Change the current filter on the filter wheel</p>
                </Menu.Item>
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
            <ModalContainer.Button.Close modal={AddSequenceItemModal.NAME}>Close</ModalContainer.Button.Close>
        </Modal.Actions>
  </ModalContainer>
)

AddSequenceItemModal.NAME = 'AddSequenceItemModal_NAME'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onAddSequenceItem: (itemType) => {
        dispatch(Actions.Modals.toggleModal(AddSequenceItemModal.NAME, false))
        ownProps.onAddSequenceItem(itemType);
    }
})

export default connect(null, mapDispatchToProps)(AddSequenceItemModal);
