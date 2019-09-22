import React from 'react';
import { Routes } from '../routes';
import { Route } from "react-router-dom";


import { SequencesListSectionMenu } from '../Sequences/SequencesList';
import { SequenceSectionMenuContainer } from '../Sequences/SequenceContainer';
import { SequenceJobImagesContainer } from '../SequenceJobs/ImagesContainer';
import { ImageSectionMenuContainer } from '../Image/ImageContainer';
import { NavItem } from './NavbarMenu';
import { PlateSolvingSectionMenuContainer } from '../PlateSolving/PlateSolvingPageContainer';
import { CameraSectionMenu } from '../Camera/Camera';
import { PHD2 } from '../PHD2/PHD2';

export class NavbarMenuItems extends React.PureComponent {

    onClick = () => this.props.onClick && this.props.onClick();

    renderSequenceSectionMenu = ({match}) => <SequenceSectionMenuContainer sequenceId={match.params.id} />;
    renderSequenceJobImages = ({match}) => <SequenceJobImagesContainer sequenceJob={match.params.itemId} />;

    render = () => (
        <React.Fragment>
            <NavItem icon='home' content='Home' exact={true} to={Routes.ROOT} onClick={this.onClick} />
            <NavItem icon='list' content='Sequences' to={Routes.SEQUENCES_PAGE} onClick={this.onClick} />
            { this.props.autoguiderEngine === 'phd2' && <NavItem icon='dot circle outline' content='PHD2' to={Routes.PHD2} onClick={this.onClick} /> }
            <NavItem icon='computer' content='INDI Server' to={Routes.INDI_PAGE} onClick={this.onClick} />
            <NavItem icon='camera' content='Camera' to={Routes.CAMERA_PAGE} onClick={this.onClick}/>
            <NavItem icon='map outline' content='Plate Solving' to={Routes.PLATE_SOLVING_PAGE} onClick={this.onClick}/>
            <NavItem icon='settings' content='System & Settings' to={Routes.SETTINGS_PAGE} onClick={this.onClick} />
            <Route exact path={Routes.SEQUENCES_LIST} component={SequencesListSectionMenu} />
            <Route path={Routes.SEQUENCE_PAGE.route} exact={true} render={this.renderSequenceSectionMenu} />
            <Route path={Routes.SEQUENCE_JOB_IMAGES} exact={true} render={this.renderSequenceJobImages} />
            <Route exact path={Routes.CAMERA_PAGE} component={CameraSectionMenu} />
            <Route exact path={Routes.PLATE_SOLVING_PAGE} component={PlateSolvingSectionMenuContainer} />
            <Route path={Routes.IMAGE_PAGE} render={({match}) => <ImageSectionMenuContainer id={match.params.id} type={match.params.type} />} />
        </React.Fragment>
    );
}


