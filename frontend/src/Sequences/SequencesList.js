import React from 'react';
import { Menu, Container, Table, Label } from 'semantic-ui-react'
import AddSequenceModalContainer from './AddSequenceModalContainer';
import { ImportSequenceContainer } from './ImportSequenceContainer';
import { NavbarSectionMenu } from '../Navigation/NavbarMenu';
import { SequenceListItemContainer } from './SequenceListItemContainer';


export const SequencesListSectionMenu = () => (
    <NavbarSectionMenu sectionName='Sequences'>
        <AddSequenceModalContainer trigger={<Menu.Item icon='add' content='new sequence' />} />
        <ImportSequenceContainer trigger={<Menu.Item icon='upload' content='import sequence' />} />
    </NavbarSectionMenu>
);

export class SequencesList extends React.PureComponent {
    renderSequenceListItem = sequence => <SequenceListItemContainer sequenceId={sequence} key={sequence} />;

    render = () => (
        <Container>
            <Table stackable selectable striped basic="very">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell><Label content='Name' /></Table.HeaderCell>
                        <Table.HeaderCell><Label content='Gear' /></Table.HeaderCell>
                        <Table.HeaderCell><Label content='Jobs'/></Table.HeaderCell>
                        <Table.HeaderCell><Label content='State'/></Table.HeaderCell>
                        <Table.HeaderCell><Label content='Action' /></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.props.sequences.map(this.renderSequenceListItem)}
                </Table.Body>
            </Table>
        </Container>
    );
}

