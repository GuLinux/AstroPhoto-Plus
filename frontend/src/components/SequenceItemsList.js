import React from 'react';
import { Table, Glyphicon, ButtonGroup, Button } from 'react-bootstrap';
import { Dialog, QuestionDialog } from './Dialogs'


const SequenceItemsList = ({sequenceItems, editSequenceItem}) => (
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
                    <td></td>
                    <td>
                        <ButtonGroup>
                            <Button bsSize="xsmall" onClick={() => editSequenceItem(sequenceItem.id)}><Glyphicon glyph="edit" /></Button>
                            <Dialog.Open modal="confirmDeleteSequenceItem" bsSize="xsmall" disabled={true}><Glyphicon glyph="minus" /></Dialog.Open>
                        </ButtonGroup>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
)

export default SequenceItemsList;
