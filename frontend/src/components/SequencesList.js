import React from 'react';
import { Button, ButtonGroup, Table, Glyphicon, Modal } from 'react-bootstrap';
import AddSequenceModalContainer from '../containers/AddSequenceModalContainer';
import ModalContainer from '../containers/ModalContainer'
import { Dialog, QuestionDialog } from './Dialogs'

const SequencesList = ({sequences, cameras, onSequenceEdit, onSequenceDelete, startSequence, duplicateSequence}) =>
(
    <div>
        <ModalContainer.Open bsStyle="primary" bsSize="xsmall" className="pull-right" modal="addSequence">new sequence</ModalContainer.Open>
        <ModalContainer name="addSequence">
            <AddSequenceModalContainer modalName="addSequence"/>
        </ModalContainer>

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
                    <td>{sequence.status}</td>
                    <td>
                        <ButtonGroup>
                            <Button onClick={e => onSequenceEdit(sequence.id)} bsSize="xsmall"><Glyphicon glyph="edit" /></Button>
                            <Dialog.Open modal={sequence.id + 'confirmSequenceDelete'} bsSize="xsmall"><Glyphicon glyph="minus" /></Dialog.Open>
                            <QuestionDialog name={sequence.id + 'confirmSequenceDelete'} title="Confirm sequence removal" buttons={[{text: 'No'}, {text: 'Yes', bsStyle: 'danger', afterClose: () => onSequenceDelete(sequence.id)}]}>
                                Do you really want to remove this sequence?
                            </QuestionDialog>
                            <Button bsSize="xsmall" disabled={ ! ['idle', 'error'].includes(sequence.status)}><Glyphicon glyph="play" onClick={() => startSequence(sequence)}/></Button>
                            <Button bsSize="xsmall" disabled={true}><Glyphicon glyph="pause" /></Button>
                            <Button bsSize="xsmall" disabled={true}><Glyphicon glyph="stop" /></Button>
                            <Button bsSize="xsmall" onClick={() => duplicateSequence(sequence)}><Glyphicon glyph="duplicate" /></Button>
                        </ButtonGroup>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    </div>
)

                            //<Button onClick={e => onSequenceDelete(sequence.id)} bsSize="xsmall"><Glyphicon glyph="minus" /></Button>

export default SequencesList;
