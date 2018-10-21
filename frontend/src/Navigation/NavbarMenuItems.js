import React from 'react';
import { Menu, Dropdown, Header } from 'semantic-ui-react';
import { Routes } from '../routes';
import { Route } from "react-router-dom";


import { SequencesListSectionMenu } from '../Sequences/SequencesList';
import { SequenceSectionMenuContainer } from '../Sequences/SequenceContainer';
import { SequenceJobImagesContainer } from '../SequenceJobs/ImagesContainer';
import { CameraSectionMenuContainer } from '../Camera/CameraContainer';
import { NavItem } from './NavbarMenu';


export const NavbarMenuItems = ({disabled, hasConnectedCameras, sectionMenu, onClick = () => true}) => (
    <React.Fragment>
        <NavItem icon='list' content='Sequences' to={Routes.SEQUENCES_PAGE} disabled={disabled} onClick={onClick} />
        <NavItem icon='computer' content='INDI Server' to={Routes.INDI_PAGE} disabled={disabled} onClick={onClick} />
        <NavItem icon='camera' content='Camera' to={Routes.CAMERA_PAGE} disabled={disabled || ! hasConnectedCameras} onClick={onClick}/>
        <NavItem icon='settings' content='System & Settings' to={Routes.SETTINGS_PAGE} disabled={disabled} onClick={onClick} />
        <Route exact path={Routes.SEQUENCES_LIST} component={SequencesListSectionMenu} />
        <Route path={Routes.SEQUENCE_PAGE.route} exact={true} render={
            ({match}) => <SequenceSectionMenuContainer sequenceId={match.params.id} />
        } />
        <Route path={Routes.SEQUENCE_JOB_IMAGES} exact={true} render={
            ({match}) => <SequenceJobImagesContainer sequenceJob={match.params.itemId} />
        } />
        <Route exact path={Routes.CAMERA_PAGE} component={CameraSectionMenuContainer} />
    </React.Fragment>
)


