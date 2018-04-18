import React from 'react';
import { Table, Glyphicon, ButtonGroup, Button, ProgressBar } from 'react-bootstrap';
import { Dialog, QuestionDialog } from './Dialogs'

const descriptionComponent = sequenceItem => (
    <span>
        {sequenceItem.description}
    </span>
);

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
    return <ProgressBar min={min} max={max} now={progress} striped bsStyle={style} active={status === 'running'} />
}

const statusComponent = sequenceItem => {
    let count = 1;
    let progress = sequenceItem.status == 'finished' ? 1 : 0;
    if(sequenceItem.type === 'shots' && sequenceItem.status !== 'idle') {
        count = sequenceItem.count;
        progress = sequenceItem.progress;
    }
    return (
        <span>
            <div className="col-xs-6">
                {sequenceItem.status}
            </div>
            <div className="col-xs-6">
                <JobProgressBar status={sequenceItem.status} min={0} max={count} progress={progress} />
            </div>
        </span>
    )
}

const SequenceItemsList = ({canEdit, sequenceItems, editSequenceItem, deleteSequenceItem, moveSequenceItem}) => (
    <Table striped bordered hover>
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
                            <Button bsSize="small" disabled={!canEdit} onClick={() => editSequenceItem(sequenceItem.id)}><Glyphicon glyph="edit" /></Button>
                            <Dialog.Open modal={sequenceItem.id + 'confirmDeleteSequenceItem'} bsSize="small"><Glyphicon glyph="minus" /></Dialog.Open>
                            <QuestionDialog name={sequenceItem.id + 'confirmDeleteSequenceItem'} title="Confirm removal" buttons={[ {text: 'no'}, {text: 'yes', afterClose: () => deleteSequenceItem(sequenceItem), bsStyle: 'danger'} ]}>
                                Do you really want to remove this element?
                            </QuestionDialog>
                            <Button bsSize="small" disabled={index===0} onClick={() => moveSequenceItem(sequenceItem, 'up')}><Glyphicon glyph="chevron-up" /></Button>
                            <Button bsSize="small" disabled={index===sequenceItems.length-1} onClick={() => moveSequenceItem(sequenceItem, 'down')}><Glyphicon glyph="chevron-down" /></Button>
                        </ButtonGroup>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
)

export default SequenceItemsList;
