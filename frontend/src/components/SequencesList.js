import React from 'react';
import { Button, ButtonGroup, Table, Glyphicon } from 'react-bootstrap';
import AddSequenceModalContainer from '../containers/AddSequenceModalContainer';
import ModalContainer from '../containers/ModalContainer'
import { Dialog, QuestionDialog } from './Dialogs'
import { canStart } from '../models/sequences'

const GearDescription = ({gear}) => {
    let elements = [];
    elements.push({ label: 'camera', description: gear.camera.connected ? gear.camera.name : 'N/A'})
    if(gear.filterWheel)
        elements.push({ label: 'filter wheel', description: gear.filterWheel.connected ? gear.filterWheel.name : 'N/A'})
    let description = elements.map(e => `${e.label}: ${e.description}`).join(', ');
    return <span>{description}</span>
}

const SequencesList = ({sequences, gear, onSequenceEdit, onSequenceDelete, startSequence, duplicateSequence}) =>
(
    <div>
        <ModalContainer.Open bsStyle="primary" bsSize="small" className="pull-right" modal="addSequence">new sequence</ModalContainer.Open>
        <ModalContainer name="addSequence">
            <AddSequenceModalContainer modalName="addSequence"/>
        </ModalContainer>

        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Gear</th>
                    <th>Sequence Items</th>
                    <th>State</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {sequences.map(sequence => (
                <tr key={sequence.id}>
                    <td><a href='#' onClick={e => onSequenceEdit(sequence.id)} >{sequence.name}</a></td>
                    <td><GearDescription gear={gear[sequence.id]} /></td>
                    <td>{sequence.sequenceItems.length}</td>
                    <td>{sequence.status}</td>
                    <td>
                        <ButtonGroup>
                            <Button title="Edit" onClick={e => onSequenceEdit(sequence.id)} bsSize="small"><Glyphicon glyph="edit" /></Button>
                            <Dialog.Open title="Remove" modal={sequence.id + 'confirmSequenceDelete'} bsSize="small"><Glyphicon glyph="minus" /></Dialog.Open>
                            <QuestionDialog name={sequence.id + 'confirmSequenceDelete'} title="Confirm sequence removal" buttons={[{text: 'No'}, {text: 'Yes', bsStyle: 'danger', afterClose: () => onSequenceDelete(sequence.id)}]}>
                                Do you really want to remove this sequence?
                            </QuestionDialog>
                            <Button title="Start" bsSize="small" disabled={!canStart(sequence)}><Glyphicon glyph="play" onClick={() => startSequence(sequence)}/></Button>
                            <Button title="Pause" bsSize="small" disabled={true}><Glyphicon glyph="pause" /></Button>
                            <Button title="Stop" bsSize="small" disabled={true}><Glyphicon glyph="stop" /></Button>
                            <Button title="Duplicate" bsSize="small" onClick={() => duplicateSequence(sequence)}><Glyphicon glyph="duplicate" /></Button>
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
