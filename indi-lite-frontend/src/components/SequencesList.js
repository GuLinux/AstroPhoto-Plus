import React from 'react';
import { Table, Glyphicon } from 'react-bootstrap';


const SequencesList = ({sequences}) => (
    <Table striped bordered hover>
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>State</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {sequences.map(sequence => (
                <tr key={sequence.id}>
                    <td>{sequence.name}</td>
                    <td></td>
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

export default SequencesList;
