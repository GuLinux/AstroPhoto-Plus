import React from 'react';
import { Container, Button, Table, Label, Menu} from 'semantic-ui-react'
import AddSequenceModalContainer from './AddSequenceModalContainer';
import { ConfirmDialog } from '../Modals/ModalDialog';
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

class SequencesList extends React.Component {
    componentDidMount = () => this.props.onMount({
        section: 'Sequences',
        navItems: [
            { icon: 'add', content: 'new sequence', openModal: AddSequenceModalContainer },
        ],
    });

    componentWillUnmount = () => this.props.onUnmount();

    render = () => {
        const {sequences, gear, onSequenceDelete, startSequence, duplicateSequence} = this.props;
        return (
            <Container>

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
                                    <Button as={Link} to={uriFor(sequence)} title="Open" icon='folder open' />
                                    <ConfirmDialog
                                        trigger={
                                            // TODO: disable when running 
                                            <Button compact size="mini" title="Remove" icon='remove' />
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
                                    <Button compact size="mini" title="Start" disabled={!canStart(sequence, gear[sequence.id])}  onClick={() => startSequence(sequence)} icon='play' />
                                    <Button compact size="mini" title="Pause" disabled={true} icon='pause' />
                                    <Button compact size="mini" title="Stop" disabled={true} icon='stop'/>
                                    <Button compact size="mini" title="Duplicate" onClick={() => duplicateSequence(sequence)} icon='copy' />
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
