import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { ConfirmFlagsDialog } from '../Modals/ModalDialog';
import { Table, Button, Progress } from 'semantic-ui-react';


const descriptionComponent = sequenceJob => <span>{sequenceJob.description}</span>

const statusComponent = sequenceJob => {
    let count = 1;
    let progress = sequenceJob.status === 'finished' ? 1 : 0;
    if(sequenceJob.type === 'shots' && sequenceJob.status !== 'idle') {
        count = sequenceJob.count;
        progress = sequenceJob.progress;
    }

    let style;
    switch(sequenceJob.status) {
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
            {sequenceJob.status + progressLabel}
        </Progress>
    )
}

const SequenceJobImagesButton = withRouter( ({history, sequenceJob}) => (
    <Button title="Images" size="small" onClick={() => history.push(`/sequences/${sequenceJob.sequence}/items/${sequenceJob.id}/images`) } icon='image' />
))



export class SequenceJobListItem extends React.PureComponent {
    render = () => {
        const { sequenceJob, canEdit, deleteSequenceJob, canMoveUp, canMoveDown,moveSequenceJob, duplicateSequenceJob } = this.props;
        return (
            <Table.Row key={sequenceJob.id}>
                <Table.Cell>{sequenceJob.typeLabel}</Table.Cell>
                <Table.Cell>{descriptionComponent(sequenceJob)}</Table.Cell>
                <Table.Cell width={3}>{statusComponent(sequenceJob)}</Table.Cell>
                <Table.Cell>
                    <Button.Group icon>
                        <Button as={Link} to={`/sequences/${sequenceJob.sequence}/items/${sequenceJob.id}`} icon='edit' title="Edit" size="small" disabled={!canEdit} />
                        <ConfirmFlagsDialog
                            trigger={<Button title="Remove" size="small" icon='remove' />}
                            header='Confirm removal'
                            resetState={true}
                            cancelButton='no'
                            confirmButton='yes'
                            onConfirm={(flags) => deleteSequenceJob(sequenceJob, flags)}
                            content='Do you really want to remove this element?'
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
                        <Button title="Move up" size="small" disabled={!canMoveUp} onClick={() => moveSequenceJob(sequenceJob, 'up')} icon='angle up' />
                        <Button title="Move down" size="small" disabled={canMoveDown} onClick={() => moveSequenceJob(sequenceJob, 'down')} icon='angle down' />
                        <Button title="Duplicate" size="small" onClick={() => duplicateSequenceJob(sequenceJob)} icon='copy' />
                        { sequenceJob.saved_images && sequenceJob.saved_images.length > 0 && <SequenceJobImagesButton sequenceJob={sequenceJob} /> }
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        )
    }
}