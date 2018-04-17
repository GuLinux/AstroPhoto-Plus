import React from 'react';
import { Table, Glyphicon, ButtonGroup, Button, ProgressBar } from 'react-bootstrap';
import { Dialog, QuestionDialog } from './Dialogs'

const descriptionComponent = sequenceItem => (
    <span>
        {sequenceItem.description}
    </span>
);

const buildProgressBar = (status, min, max, progress) => {
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
    let statusSubComponent = null;
    if(sequenceItem.type === 'shots' && sequenceItem.status !== 'idle') {
        statusSubComponent = buildProgressBar(sequenceItem.status, 0, sequenceItem.count, sequenceItem.progress);
    }
    return (
        <span>
            {sequenceItem.status}
            {statusSubComponent}
        </span>
    )
}

const SequenceItemsList = ({sequenceItems, editSequenceItem, deleteSequenceItem}) => (
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
            {sequenceItems.map(sequenceItem => (
                <tr key={sequenceItem.id}>
                    <td>{sequenceItem.typeLabel}</td>
                    <td>{descriptionComponent(sequenceItem)}</td>
                    <td>{statusComponent(sequenceItem)}</td>
                    <td>
                        <ButtonGroup>
                            <Button bsSize="xsmall" onClick={() => editSequenceItem(sequenceItem.id)}><Glyphicon glyph="edit" /></Button>
                            <Dialog.Open modal={sequenceItem.id + 'confirmDeleteSequenceItem'} bsSize="xsmall"><Glyphicon glyph="minus" /></Dialog.Open>
                            <QuestionDialog name={sequenceItem.id + 'confirmDeleteSequenceItem'} title="Confirm removal" buttons={[ {text: 'no'}, {text: 'yes', afterClose: () => deleteSequenceItem(sequenceItem), bsStyle: 'danger'} ]}>
                                Do you really want to remove this element?
                            </QuestionDialog>
                        </ButtonGroup>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
)

export default SequenceItemsList;
