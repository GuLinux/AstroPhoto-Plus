import React from 'react';

import { Table, Glyphicon } from 'react-bootstrap';


const SessionsList = ({sessions, cameras, onCreateSequence, onSessionEdit, onSessionDelete}) =>
(
    <Table striped bordered hover>
        <thead>
            <tr>
                <th>Name</th>
                <th>Camera</th>
                <th>Sequences</th>
                <th>State</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        {sessions.map(session => (
            <tr key={session.id}>
                <td><a href='#' onClick={e => onSessionEdit(session.id)} >{session.name}</a></td>
                <td>{session.camera in cameras ? cameras[session.camera] : 'N/A'}</td>
                <td>{session.sequences.length}</td>
                <td></td>
                <td>
                    <a href='#' onClick={e => onSessionEdit(session.id)} ><Glyphicon glyph="edit" /></a>
                    <a href='#' onClick={e => onSessionDelete(session.id)} ><Glyphicon glyph="minus" /></a>
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
