import React from 'react';
import { Table, Glyphicon, ButtonGroup, Button, ProgressBar } from 'react-bootstrap';
import { Dialog, QuestionDialog } from '../Modals/Dialogs'
import { LinkContainer } from 'react-router-bootstrap';

const descriptionComponent = sequenceItem => <span>{sequenceItem.description}</span>

const JobProgressBar = ({status, min, max, progress}) => {
    let style;
    switch(status) {
        case 'finished':
            style='success'; break;
        case 'error':
            style='danger'; break;
        default:
            style='info';
    }
    let progressLabel = progress > 0 ? `${progress}/${max}` : '';
    return <ProgressBar className="sequence-item-progress" min={min} max={max} now={progress} label={progressLabel} striped bsStyle={style} active={status === 'running'} />
}

const statusComponent = sequenceItem => {
    let count = 1;
    let progress = sequenceItem.status === 'finished' ? 1 : 0;
    if(sequenceItem.type === 'shots' && sequenceItem.status !== 'idle') {
        count = sequenceItem.count;
        progress = sequenceItem.progress;
    }
    return (
        <span>
            <div className="row">
                <div className="col-xs-12">
                    {sequenceItem.status}
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <JobProgressBar status={sequenceItem.status} min={0} max={count} progress={progress} />
                </div>
            </div>
        </span>
    )
}

const SequenceItemsList = ({canEdit, sequenceItems, deleteSequenceItem, moveSequenceItem, duplicateSequenceItem}) => (
    <Table striped bordered hover responsive>
        <thead>
            <tr>
                <th>Type</th>
                <th>Description</th>
                <th>State</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {sequenceItems.map( (sequenceItem, index) => (
                <tr key={sequenceItem.id}>
                    <td>{sequenceItem.typeLabel}</td>
                    <td>{descriptionComponent(sequenceItem)}</td>
                    <td>{statusComponent(sequenceItem)}</td>
                    <td>
                        <ButtonGroup>
                            <LinkContainer to={`/sequences/${sequenceItem.sequence}/items/${sequenceItem.id}`}>
                            <Button title="Edit" bsSize="small" disabled={!canEdit}><Glyphicon glyph="edit" /></Button>
                            </LinkContainer>
                            <Dialog.Button.Open title="Remove" modal={sequenceItem.id + 'confirmDeleteSequenceItem'} bsSize="small"><Glyphicon glyph="minus" /></Dialog.Button.Open>
                            <QuestionDialog name={sequenceItem.id + 'confirmDeleteSequenceItem'} title="Confirm removal" buttons={[ {text: 'no'}, {text: 'yes', afterClose: () => deleteSequenceItem(sequenceItem), bsStyle: 'danger'} ]}>
                                Do you really want to remove this element?
                            </QuestionDialog>
                            <Button title="Move up" bsSize="small" disabled={index===0} onClick={() => moveSequenceItem(sequenceItem, 'up')}><Glyphicon glyph="chevron-up" /></Button>
                            <Button title="Move down" bsSize="small" disabled={index===sequenceItems.length-1} onClick={() => moveSequenceItem(sequenceItem, 'down')}><Glyphicon glyph="chevron-down" /></Button>
                            <Button title="Duplicate" bsSize="small" onClick={() => duplicateSequenceItem(sequenceItem)}><Glyphicon glyph="duplicate" /></Button>
                        </ButtonGroup>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
)

export default SequenceItemsList;
