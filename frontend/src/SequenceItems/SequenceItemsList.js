import React from 'react';
import { Table, Button, Progress } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { ConfirmDialog } from '../Modals/ModalDialog';

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
        case 'running':
            style={ active: true }; break;
        default:
            style= { disabled: true };
    }
    let progressLabel = progress > 0 ? `: ${progress}/${count}` : '';
    return (
        <Progress {...style} total={count} size="small" value={progress}>
            {sequenceItem.status + progressLabel}
        </Progress>
    )
}

const SequenceItemImagesButton = withRouter( ({history, sequenceItem}) => (
    <Button title="Images" size="small" onClick={() => history.push(`/sequences/${sequenceItem.sequence}/items/${sequenceItem.id}/images`) } icon='image' />
))



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
                            <Button as={Link} to={`/sequences/${sequenceItem.sequence}/items/${sequenceItem.id}`} icon='edit' title="Edit" size="small" disabled={!canEdit} />
                            <ConfirmDialog
                                trigger={<Button title="Remove" size="small" icon='remove' />}
                                header='Confirm removal'
                                cancelButton='no'
                                confirmButton='yes'
                                onConfirm={() => deleteSequenceItem(sequenceItem)}
                                content='Do you really want to remove this element?'
                                size='mini'
                                basic
                                centered={false}

                            />
                            <Button title="Move up" size="small" disabled={index===0} onClick={() => moveSequenceItem(sequenceItem, 'up')} icon='angle up' />
                            <Button title="Move down" size="small" disabled={index===sequenceItems.length-1} onClick={() => moveSequenceItem(sequenceItem, 'down')} icon='angle down' />
                            <Button title="Duplicate" size="small" onClick={() => duplicateSequenceItem(sequenceItem)} icon='copy' />
                            { sequenceItem.saved_images && sequenceItem.saved_images.length > 0 && <SequenceItemImagesButton sequenceItem={sequenceItem} /> }
                        </Button.Group>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
)

export default SequenceItemsList;
