import React from 'react';

import { Table, Glyphicon } from 'react-bootstrap';


const SequencesList = ({sequences, cameras, onSequenceEdit, onSequenceDelete}) =>
(
    <Table striped bordered hover>
        <thead>
            <tr>
                <th>Name</th>
                <th>Camera</th>
                <th>Sequence Items</th>
                <th>State</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        {sequences.map(sequence => (
            <tr key={sequence.id}>
                <td><a href='#' onClick={e => onSequenceEdit(sequence.id)} >{sequence.name}</a></td>
                <td>{sequence.camera in cameras ? cameras[sequence.camera] : 'N/A'}</td>
                <td>{sequence.sequenceItems.length}</td>
                <td></td>
                <td>
                    <a href='#' onClick={e => onSequenceEdit(sequence.id)} ><Glyphicon glyph="edit" /></a>
                    <a href='#' onClick={e => onSequenceDelete(sequence.id)} ><Glyphicon glyph="minus" /></a>
                    <Glyphicon glyph="play" />
                    <Glyphicon glyph="pause" />
                    <Glyphicon glyph="stop" />
                </td>
            </tr>
        ))}
        </tbody>
    </Table>
)

export default SequencesList;
