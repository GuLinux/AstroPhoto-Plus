import React from 'react';
import { Button, ButtonGroup, Table, Glyphicon } from 'react-bootstrap';
import AddSequenceModalContainer from './AddSequenceModalContainer';
import ModalContainer from '../Modals/ModalContainer'
import { Dialog, QuestionDialog } from '../Modals/Dialogs'
import { canStart } from './model'
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const GearDescription = ({gear}) => {
    let elements = [];
    elements.push({ label: 'camera', description: gear.camera.connected ? gear.camera.name : 'N/A'})
    if(gear.filterWheel)
        elements.push({ label: 'filter wheel', description: gear.filterWheel.connected ? gear.filterWheel.name : 'N/A'})
    let description = elements.map(e => `${e.label}: ${e.description}`).join(', ');
    return <span>{description}</span>
}

const uriFor = sequence => '/sequences/' + sequence.id;

const SequencesList = ({sequences, gear, onSequenceDelete, startSequence, duplicateSequence}) =>
(
    <div>
        <ModalContainer.Button.Open bsStyle="primary" bsSize="small" className="pull-right" modal="addSequence">new sequence</ModalContainer.Button.Open>
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
                    <td>
                        <Link to={uriFor(sequence)}>
                            {sequence.name}
                        </Link>
                    </td>
                    <td><GearDescription gear={gear[sequence.id]} /></td>
                    <td>{sequence.sequenceItems.length}</td>
                    <td>{sequence.status}</td>
                    <td>
                        <ButtonGroup>
                            <LinkContainer to={uriFor(sequence)}>
                                <Button title="Edit" bsSize="small">
                                    <Glyphicon glyph="edit" />
                                </Button>
                            </LinkContainer>
                            <Dialog.Button.Open title="Remove" modal={sequence.id + 'confirmSequenceDelete'} bsSize="small"><Glyphicon glyph="minus" /></Dialog.Button.Open>
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
