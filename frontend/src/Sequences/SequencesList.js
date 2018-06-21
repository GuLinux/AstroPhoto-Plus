import React from 'react';
import { Container, Button, Table, Label, Grid } from 'semantic-ui-react'
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
    <Container>
        <Grid columns={1}>
            <Grid.Column textAlign="right">
                <ModalContainer.Button.Open primary size='mini' modal={AddSequenceModalContainer.NAME}>new sequence</ModalContainer.Button.Open>
            </Grid.Column>
        </Grid>
        <AddSequenceModalContainer />

        <Table stackable selectable striped basic="very">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell><Label content='Name' /></Table.HeaderCell>
                    <Table.HeaderCell><Label content='Gear' /></Table.HeaderCell>
                    <Table.HeaderCell><Label content='Sequence Items'/></Table.HeaderCell>
                    <Table.HeaderCell><Label content='State'/></Table.HeaderCell>
                    <Table.HeaderCell><Label content='Action' /></Table.HeaderCell>
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
                            <Button as={Link} to={uriFor(sequence)} title="Edit" icon='edit' />
                            <Dialog.Button.Open compact size="mini" title="Remove" modal={sequence.id + 'confirmSequenceDelete'} icon='remove' />
                            <Button compact size="mini" title="Start" disabled={!canStart(sequence)}  onClick={() => startSequence(sequence)} icon='play' />
                            <Button compact size="mini" title="Pause" disabled={true} icon='pause' />
                            <Button compact size="mini" title="Stop" disabled={true} icon='stop'/>
                            <Button compact size="mini" title="Duplicate" onClick={() => duplicateSequence(sequence)} icon='copy' />
                        </Button.Group>
                        <QuestionDialog name={sequence.id + 'confirmSequenceDelete'} title="Confirm sequence removal" buttons={[{text: 'No'}, {text: 'Yes', color: 'red', afterClose: () => onSequenceDelete(sequence.id)}]}>
                            Do you really want to remove this sequence?
                        </QuestionDialog>
                    </Table.Cell>
                </Table.Row>
            ))}
            </Table.Body>
        </Table>
    </Container>
)

                            //<Button onClick={e => onSequenceDelete(sequence.id)} size="xmini"><Glyphicon glyph="minus" /></Button>

export default SequencesList;
