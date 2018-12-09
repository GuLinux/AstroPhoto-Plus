import React from 'react';
import { Dropdown, Button, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { ConfirmFlagsDialog } from '../Modals/ModalDialog';
import AddSequenceModalContainer from './AddSequenceModalContainer';



const uriFor = sequence => '/sequences/' + sequence.id;

const GearDescription = ({gear}) => {
    let elements = [];
    elements.push({ label: 'camera', description: gear.camera ? gear.camera.name : 'N/A'})
    if(gear.filterWheel)
        elements.push({ label: 'filter wheel', description: gear.filterWheel ? gear.filterWheel.name : 'N/A'})
    let description = elements.map(e => `${e.label}: ${e.description}`).join(', ');
    return <span>{description}</span>
}

export class SequenceListItem extends React.PureComponent {

    duplicateSequence = () => this.props.duplicateSequence(this.props.sequence);
    stopSequence = () => this.props.stopSequence(this.props.sequence);
    startSequence = () => this.props.startSequence(this.props.sequence);
    onSequenceDelete = (flags) => this.props.onSequenceDelete(this.props.sequence.id, flags);
    resetSequence = (flags) => this.props.resetSequence(this.props.sequence.id, flags);

    render = () => {
        const {sequence, gear, sequenceJobsLength, canStart, canStop, canReset, canEdit} = this.props;
        return (
            <Table.Row key={sequence.id}>
                <Table.Cell verticalAlign='middle'>
                    <Link to={uriFor(sequence)}>
                        {sequence.name}
                    </Link>
                </Table.Cell>
                <Table.Cell verticalAlign='middle'><GearDescription gear={gear} /></Table.Cell>
                <Table.Cell verticalAlign='middle'>{sequenceJobsLength}</Table.Cell>
                <Table.Cell verticalAlign='middle'>{sequence.status}</Table.Cell>
                <Table.Cell>
                    <Button.Group icon compact size='mini'>
                        <Button as={Link} to={uriFor(sequence)} title="Open" icon='folder open' />
                        <AddSequenceModalContainer trigger={<Button disabled={!canEdit} title="Edit" icon='edit' />} sequence={sequence} />
                        <Button title="Start" disabled={!canStart}  onClick={this.startSequence} icon='play' />
                        <Button title="Stop" disabled={!canStop} onClick={this.stopSequence} icon='stop'/>

                        <Button as='div'>
                            <Dropdown text='more...' closeOnChange={true}>
                                <Dropdown.Menu>
                                    <Dropdown.Item text="Duplicate" onClick={this.duplicateSequence} icon='copy' />
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
                                        onConfirm={this.onSequenceDelete}
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
                                            <Dropdown.Item text="Reset" disabled={!canReset} icon='redo'/>
                                        }
                                        content='This will reset the status of all jobs in this sequence. Are you sure?'
                                        header='Confirm sequence reset'
                                        cancelButton='No'
                                        confirmButton='Yes'
                                        onConfirm={this.resetSequence}
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
        );
    }
}
