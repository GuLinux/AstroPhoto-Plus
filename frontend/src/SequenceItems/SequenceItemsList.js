import React from 'react';
import { Grid, Table, Icon, Button, Progress, Container, Segment} from 'semantic-ui-react';
import { Dialog, QuestionDialog } from '../Modals/Dialogs'
import { Link } from 'react-router-dom';

const descriptionComponent = sequenceItem => <span>{sequenceItem.description}</span>

const statusComponent = sequenceItem => {
    let count = 1;
    let progress = sequenceItem.status === 'finished' ? 1 : 0;
    if(sequenceItem.type === 'shots' && sequenceItem.status !== 'idle') {
        count = sequenceItem.count;
        progress = sequenceItem.progress;
    }

    let style;
    switch(sequenceItem.status) {
        case 'finished':
            style={ success: true }; break;
        case 'error':
            style={ error: true }; break;
        default:
            style= {};
    }
    let progressLabel = progress > 0 ? `: ${progress}/${count}` : '';
    return (
        <Progress {...style} total={count} size="small" value={progress}active={sequenceItem.status === 'running'}>
            {sequenceItem.status + progressLabel}
        </Progress>
    )
}

const SequenceItemsList = ({canEdit, sequenceItems, deleteSequenceItem, moveSequenceItem, duplicateSequenceItem}) => (
    <Table stackable striped basic="very" selectable>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>State</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {sequenceItems.map( (sequenceItem, index) => (
                <Table.Row key={sequenceItem.id}>
                    <Table.Cell>{sequenceItem.typeLabel}</Table.Cell>
                    <Table.Cell>{descriptionComponent(sequenceItem)}</Table.Cell>
                    <Table.Cell width={3}>{statusComponent(sequenceItem)}</Table.Cell>
                    <Table.Cell>
                        <Button.Group icon>
                            <Button as={Link} to={`/sequences/${sequenceItem.sequence}/items/${sequenceItem.id}`} title="Edit" size="small" disabled={!canEdit}><Icon name="edit" /></Button>
                            <Dialog.Button.Open title="Remove" modal={sequenceItem.id + 'confirmDeleteSequenceItem'} size="small"><Icon name="remove" /></Dialog.Button.Open>
                            <QuestionDialog name={sequenceItem.id + 'confirmDeleteSequenceItem'} title="Confirm removal" buttons={[ {text: 'no'}, {text: 'yes', afterClose: () => deleteSequenceItem(sequenceItem), primary: true} ]}>
                                Do you really want to remove this element?
                            </QuestionDialog>
                            <Button title="Move up" size="small" disabled={index===0} onClick={() => moveSequenceItem(sequenceItem, 'up')}><Icon name="angle up" /></Button>
                            <Button title="Move down" size="small" disabled={index===sequenceItems.length-1} onClick={() => moveSequenceItem(sequenceItem, 'down')}><Icon name="angle down" /></Button>
                            <Button title="Duplicate" size="small" onClick={() => duplicateSequenceItem(sequenceItem)}><Icon name="copy" /></Button>
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
)

export default SequenceItemsList;
