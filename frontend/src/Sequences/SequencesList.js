import React from 'react';
import { Dropdown, Container, Button, Table, Label } from 'semantic-ui-react'
import AddSequenceModalContainer from './AddSequenceModalContainer';
import { ConfirmDialog } from '../Modals/ModalDialog';
import { canStart } from './model'
import { Link } from 'react-router-dom';
import ImportSequenceContainer from './ImportSequenceContainer';

const GearDescription = ({gear}) => {
    let elements = [];
    elements.push({ label: 'camera', description: gear.camera.connected ? gear.camera.name : 'N/A'})
    if(gear.filterWheel)
        elements.push({ label: 'filter wheel', description: gear.filterWheel.connected ? gear.filterWheel.name : 'N/A'})
    let description = elements.map(e => `${e.label}: ${e.description}`).join(', ');
    return <span>{description}</span>
}

const uriFor = sequence => '/sequences/' + sequence.id;

class SequencesList extends React.Component {
    componentDidMount = () => this.props.onMount({
        section: 'Sequences',
        navItems: [
            { icon: 'add', content: 'new sequence', openModal: AddSequenceModalContainer },
            { icon: 'upload', content: 'import sequence', openModal: ImportSequenceContainer },
        ],
    });

    componentWillUnmount = () => this.props.onUnmount();

    render = () => {
        const {sequences, gear, onSequenceDelete, startSequence, duplicateSequence, stopSequence, resetSequence} = this.props;
        return (
            <Container>

                <Table stackable selectable striped basic="very">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell><Label content='Name' /></Table.HeaderCell>
                            <Table.HeaderCell><Label content='Gear' /></Table.HeaderCell>
                            <Table.HeaderCell><Label content='Sequence Jobs'/></Table.HeaderCell>
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
                                    <Button title="Start" disabled={!canStart(sequence, gear[sequence.id])}  onClick={() => startSequence(sequence)} icon='play' />
                                    <Button title="Stop" disabled={sequence.status !== 'running'} onClick={() => stopSequence(sequence)} icon='stop'/>

                                    <Button as='div'>
                                        <Dropdown text='more...' closeOnChange={true}>
                                            <Dropdown.Menu>
                                                <Dropdown.Item text="Duplicate" onClick={() => duplicateSequence(sequence)} icon='copy' />
                                                <ConfirmDialog
                                                    trigger={
                                                        // TODO: disable when running 
                                                        <Dropdown.Item text="Remove" icon='remove' />
                                                    }
                                                    content='Do you really want to remove this sequence?'
                                                    header='Confirm sequence removal'
                                                    cancelButton='No'
                                                    confirmButton='Yes'
                                                    onConfirm={() => onSequenceDelete(sequence.id)}
                                                    size='mini'
                                                    basic
                                                    centered={false}
                                                />
                                                <ConfirmDialog
                                                    trigger={
                                                        <Dropdown.Item text="Reset" disabled={sequence.status === 'running'} icon='redo'/>
                                                    }
                                                    content='This will reset the status of all jobs in this sequence. Are you sure?'
                                                    header='Confirm sequence reset'
                                                    cancelButton='No'
                                                    confirmButton='Yes'
                                                    onConfirm={() => resetSequence(sequence)}
                                                    size='mini'
                                                    basic
                                                    centered={false}
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
    }
}


                            //<Button onClick={e => onSequenceDelete(sequence.id)} size="xmini"><Glyphicon glyph="minus" /></Button>

export default SequencesList;
