import React from 'react';
import { Table, Glyphicon, ButtonGroup, Button } from 'react-bootstrap';
import { Dialog, QuestionDialog } from './Dialogs'


const SequenceItemsList = ({sequenceItems, editSequenceItem, deleteSequenceItem}) => (
    <Table striped bordered hover>
        <thead>
            <tr>
                <th>Type</th>
                <th>Description</th>
                <th>State</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {sequenceItems.map(sequenceItem => (
                <tr key={sequenceItem.id}>
                    <td>{sequenceItem.typeLabel}</td>
                    <td>{sequenceItem.description}</td>
                    <td>{sequenceItem.status}</td>
                    <td>
                        <ButtonGroup>
                            <Button bsSize="xsmall" onClick={() => editSequenceItem(sequenceItem.id)}><Glyphicon glyph="edit" /></Button>
                            <Dialog.Open modal="confirmDeleteSequenceItem" bsSize="xsmall"><Glyphicon glyph="minus" /></Dialog.Open>
                            <QuestionDialog name="confirmDeleteSequenceItem" title="Confirm removal" buttons={[ {text: 'no'}, {text: 'yes', afterClose: () => deleteSequenceItem(sequenceItem), bsStyle: 'danger'} ]}>
                                Do you really want to remove this element?
                            </QuestionDialog>
                        </ButtonGroup>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
)

export default SequenceItemsList;
