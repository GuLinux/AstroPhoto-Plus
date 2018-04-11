import React from 'react';
import { Table, Glyphicon } from 'react-bootstrap';


const SequenceItemsList = ({sequenceItems}) => (
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
                        <Glyphicon glyph="edit" />
                        <Glyphicon glyph="minus" />
                        <Glyphicon glyph="play" />
                        <Glyphicon glyph="pause" />
                        <Glyphicon glyph="stop" />
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
)

export default SequenceItemsList;
