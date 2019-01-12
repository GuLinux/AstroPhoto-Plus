import React from 'react';
import { Menu, Container, Header, Card} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import LastCapturedSequenceImageContainer from './LastCapturedSequenceImageContainer';
import { NotFoundPage } from '../components/NotFoundPage';
import { ConfirmFlagsDialog } from '../Modals/ModalDialog';
import { NavbarSectionMenu } from '../Navigation/NavbarMenu';
import { Routes } from '../routes';
import { AddSequenceJobModal } from '../SequenceJobs/AddSequenceJobModal';
import { withRouter } from 'react-router';
import { SequenceJobsList } from '../SequenceJobs/SequenceJobsList';
import { ExposuresCardContainer, CameraDetailsCardContainer, FilterWheelDetailsCardContainer } from './SequenceStatusCardsContainer';

export class SequenceSectionMenu extends React.PureComponent {

    startSequence = () => this.props.startSequence(this.props.sequence);
    stopSequence = () => this.props.stopSequence(this.props.sequence);
    resetSequence = (flags) => this.props.resetSequence(this.props.sequence, flags);
    onCreateSequenceJob = (type) => this.props.onCreateSequenceJob(type, this.props.sequence.id);

    render = () => {
        const { sequence, canStart, canEdit, canReset, canStop} = this.props;
        return sequence ? (
            <NavbarSectionMenu sectionName='Sequence' sectionText={sequence.name}>
                <Menu.Item onClick={this.startSequence} icon='play' content='start' disabled={!canStart} />
                <Menu.Item onClick={this.stopSequence} icon='stop' content='stop' disabled={!canStop} />
                <ConfirmFlagsDialog
                    content='This will reset the status of all jobs in this sequence. Are you sure?'
                    header='Confim sequence reset'
                    cancelButton='No'
                    confirmButton='Yes'
                    flags={[
                        {
                            name: 'remove_files',
                            label: 'Also remove all fits files',
                        },
                    ]}
                    onConfirm={this.resetSequence}
                    resetState={true}
                    size={'mini'}
                    basic={true}
                    centered={false}
                    trigger={<Menu.Item icon='redo' disabled={!canReset} content='reset' />}
                />
                <AddSequenceJob
                    onCreateSequenceJob={this.onCreateSequenceJob}
                    sequenceId={sequence.id}
                    hasFilterWheel={sequence.filterWheel && sequence.filterQueel !== 'none'}
                    trigger={<Menu.Item icon='add' disabled={!canEdit} content='new job' />}
                />
                <Menu.Item as={Link} to={Routes.SEQUENCES_LIST} content='back to sequences' icon='arrow left' />
            </NavbarSectionMenu>
        ) : null;
    }
}

const AddSequenceJob = withRouter( ({history, onCreateSequenceJob, sequenceId, trigger, hasFilterWheel}) => (
    <AddSequenceJobModal trigger={trigger} hasFilterWheel={hasFilterWheel} onAddSequenceJob={(...args) => {
        onCreateSequenceJob(...args);
        history.push('/sequences/' + sequenceId + '/items/pending')
    }} />
))


export const Sequence = ({ sequence, canEdit }) => sequence ? (
    <Container>
        <Header size="medium">{sequence.name}</Header>
        <SequenceJobsList canEdit={canEdit} sequenceJobs={sequence.sequenceJobs} />
        <Card.Group>
            <ExposuresCardContainer sequenceId={sequence.id} />
            <CameraDetailsCardContainer sequenceId={sequence.id} cameraId={sequence.camera} />
            <FilterWheelDetailsCardContainer filterWheelId={sequence.filterWheel} />
        </Card.Group>
        <LastCapturedSequenceImageContainer sequenceId={sequence.id} />
    </Container>
) : <NotFoundPage
        title='Sequence not found'
        message='The requested sequence was not found on the server. It might have been deleted, or it might not be synchronized yet.'
        backButtonText='Back to sequences list'
        backToUrl='/sequences/all'
    />;

