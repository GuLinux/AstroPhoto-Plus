import React from 'react';
import { Button, Table, Icon, Label } from 'semantic-ui-react'
import AddSequenceModalContainer from './AddSequenceModalContainer';
import ModalContainer from '../Modals/ModalContainer'
import { Dialog, QuestionDialog } from '../Modals/Dialogs'
import { canStart } from './model'
import { Link } from 'react-router-dom';

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
        <ModalContainer.Button.Open bsStyle="primary" className="pull-right" modal="addSequence">new sequence</ModalContainer.Button.Open>
        <ModalContainer name="addSequence">
            <AddSequenceModalContainer modalName="addSequence"/>
        </ModalContainer>

        <Table stackable selectable striped basic="very">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell><Label>Name</Label></Table.HeaderCell>
                    <Table.HeaderCell><Label>Gear</Label></Table.HeaderCell>
                    <Table.HeaderCell><Label>Sequence Items</Label></Table.HeaderCell>
                    <Table.HeaderCell><Label>State</Label></Table.HeaderCell>
                    <Table.HeaderCell><Label>Action</Label></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
            {sequences.map(sequence => (
                <Table.Row key={sequence.id}>
                    <Table.Cell verticalAlign='middle'>
                        <Link to={uriFor(sequence)}>
                            {sequence.name}
                        </Link>
                    </Table.Cell>
                    <Table.Cell verticalAlign='middle'><GearDescription gear={gear[sequence.id]} /></Table.Cell>
                    <Table.Cell verticalAlign='middle'>{sequence.sequenceItems.length}</Table.Cell>
                    <Table.Cell verticalAlign='middle'>{sequence.status}</Table.Cell>
                    <Table.Cell>
                        <Button.Group icon>
                            <Button as={Link} to={uriFor(sequence)} title="Edit">
                                <Icon name="edit" />
                            </Button>
                            <Dialog.Button.Open compact size="mini" title="Remove" modal={sequence.id + 'confirmSequenceDelete'}><Icon name="remove" /></Dialog.Button.Open>
                            <Button compact size="mini" title="Start" disabled={!canStart(sequence)}  onClick={() => startSequence(sequence)}><Icon name="play" /></Button>
                            <Button compact size="mini" title="Pause" disabled={true}><Icon name="pause" /></Button>
                            <Button compact size="mini" title="Stop" disabled={true}><Icon name="stop" /></Button>
                            <Button compact size="mini" title="Duplicate" onClick={() => duplicateSequence(sequence)}><Icon name="copy" /></Button>
                        </Button.Group>
                        <QuestionDialog name={sequence.id + 'confirmSequenceDelete'} title="Confirm sequence removal" buttons={[{text: 'No'}, {text: 'Yes', bsStyle: 'danger', afterClose: () => onSequenceDelete(sequence.id)}]}>
                            Do you really want to remove this sequence?
                        </QuestionDialog>
                    </Table.Cell>
                </Table.Row>
            ))}
            </Table.Body>
        </Table>
    </div>
)

                            //<Button onClick={e => onSequenceDelete(sequence.id)} size="xmini"><Glyphicon glyph="minus" /></Button>

export default SequencesList;
