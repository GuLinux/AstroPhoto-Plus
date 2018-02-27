import React from 'react';

import { Table, Glyphicon } from 'react-bootstrap';


        // <Session key={session.id} {...session} onCreateSequence={onCreateSequence} />
const SessionsList = ({sessions, onCreateSequence, onSessionEdit}) =>
(
    <Table striped bordered hover>
        <thead>
            <tr>
                <th>Name</th>
                <th>Sequences</th>
                <th>State</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        {sessions.map(session => (
            <tr key={session.id}>
                <td>{session.name}</td>
                <td>{session.sequences.length}</td>
                <td></td>
                <td>
                    <Glyphicon glyph="edit" onClick={e => onSessionEdit(session.id)} />
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

export default SessionsList;
