import React from 'react';
import { Table } from 'semantic-ui-react';
import { SequenceJobsListItemContainer } from './SequenceJobListItemContainer';
export class SequenceJobsList extends React.PureComponent {

    renderSequenceJob = (id, index) => <SequenceJobsListItemContainer
        canEdit={this.props.canEdit}
        sequenceJobId={id} key={index}
        canMoveUp={index !== 0}
        canMoveDown={index < this.props.sequenceJobs.length -1}
    />;

    render = () => {
        const {sequenceJobs} = this.props;
        return (
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
                    {sequenceJobs.map(this.renderSequenceJob)} 
                </Table.Body>
            </Table>
        );
    }
}