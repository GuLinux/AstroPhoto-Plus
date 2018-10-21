import React from 'react';
import { Menu, Dropdown, Container, Button, Table, Label } from 'semantic-ui-react'
import AddSequenceModalContainer from './AddSequenceModalContainer';
import { ConfirmFlagsDialog } from '../Modals/ModalDialog';
import { Link } from 'react-router-dom';
import ImportSequenceContainer from './ImportSequenceContainer';
import { NavbarSectionMenu, NavItem } from '../Navigation/NavbarMenu';

const GearDescription = ({gear}) => {
    let elements = [];
    elements.push({ label: 'camera', description: gear.camera.connected ? gear.camera.name : 'N/A'})
    if(gear.filterWheel)
        elements.push({ label: 'filter wheel', description: gear.filterWheel.connected ? gear.filterWheel.name : 'N/A'})
    let description = elements.map(e => `${e.label}: ${e.description}`).join(', ');
    return <span>{description}</span>
}

const uriFor = sequence => '/sequences/' + sequence.id;

export const SequencesListSectionMenu = () => (
    <NavbarSectionMenu sectionName='Sequences'>
        <AddSequenceModalContainer trigger={<Menu.Item icon='add' content='new sequence' />} />
        <ImportSequenceContainer trigger={<Menu.Item icon='upload' content='import sequence' />} />
    </NavbarSectionMenu>
);

export const SequencesList = ({sequences, gear, onSequenceDelete, startSequence, duplicateSequence, stopSequence, resetSequence}) => (
    <Container>
        <Table stackable selectable striped basic="very">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell><Label content='Name' /></Table.HeaderCell>
                    <Table.HeaderCell><Label content='Gear' /></Table.HeaderCell>
                    <Table.HeaderCell><Label content='Jobs'/></Table.HeaderCell>
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
                    <Table.Cell verticalAlign='middle'>{sequence.sequenceJobs.length}</Table.Cell>
                    <Table.Cell verticalAlign='middle'>{sequence.status}</Table.Cell>
                    <Table.Cell>
                        <Button.Group icon compact size='mini'>
                            <Button as={Link} to={uriFor(sequence)} title="Open" icon='folder open' />
                            <AddSequenceModalContainer trigger={<Button title="Edit" icon='edit' />} sequence={sequence} />
                            <Button title="Start" disabled={!sequence.canStart(gear[sequence.id])}  onClick={() => startSequence(sequence)} icon='play' />
                            <Button title="Stop" disabled={!sequence.canStop} onClick={() => stopSequence(sequence)} icon='stop'/>

                            <Button as='div'>
                                <Dropdown text='more...' closeOnChange={true}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item text="Duplicate" onClick={() => duplicateSequence(sequence)} icon='copy' />
                                        <ConfirmFlagsDialog
                                            trigger={
                                                // TODO: disable when running 
                                                <Dropdown.Item text="Remove" icon='remove' />
                                            }
                                            content='Do you really want to remove this sequence?'
                                            header='Confirm sequence removal'
                                            cancelButton='No'
                                            resetState={true}
                                            confirmButton='Yes'
                                            onConfirm={(flags) => onSequenceDelete(sequence.id, flags)}
                                            size='mini'
                                            basic
                                            centered={false}
                                            flags={[
                                                {
                                                    name: 'remove_files',
                                                    label: 'Also remove all fits files',
                                                },
                                            ]}
                                        />
                                        <ConfirmFlagsDialog
                                            trigger={
                                                <Dropdown.Item text="Reset" disabled={!sequence.canReset} icon='redo'/>
                                            }
                                            content='This will reset the status of all jobs in this sequence. Are you sure?'
                                            header='Confirm sequence reset'
                                            cancelButton='No'
                                            confirmButton='Yes'
                                            onConfirm={(flags) => resetSequence(sequence, flags)}
                                            resetState={true}
                                            size='mini'
                                            basic
                                            centered={false}
                                            flags={[
                                                {
                                                    name: 'remove_files',
                                                    label: 'Also remove all fits files',
                                                },
                                            ]}
                                       />


                                        <Dropdown.Item text="Export" as='a' href={`/api/sequences/${sequence.id}/export`} icon='save' />

                                    </Dropdown.Menu>
                                </Dropdown>
                            </Button>
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
            ))}
            </Table.Body>
        </Table>
    </Container>
)

