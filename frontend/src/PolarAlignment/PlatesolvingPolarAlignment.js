import React from 'react';
import { connect } from 'react-redux';
import { CameraShootingSectionMenuEntriesContaner, CameraImageOptionsSectionMenuEntriesContainer } from '../Camera/CameraSectionMenuEntriesContainer.js';

import { PlateSolvingContainer } from '../PlateSolving/PlateSolvingContainer';
import { POLAR_PLATESOLVING } from '../Camera/sections';

class PlatesolvingPolarAlignmentMenuComponent extends React.Component {
    onShoot = shootParams => {
        //this.props.startDARV(shootParams);
        return false;
    }

    render = () => (
        <React.Fragment>
            <CameraShootingSectionMenuEntriesContaner onShoot={this.onShoot} section={POLAR_PLATESOLVING} />
        </React.Fragment>
    );
}

export const PlatesolvingPolarAlignmentMenu = connect(null, {})(PlatesolvingPolarAlignmentMenuComponent);





export const PlatesolvingPolarAlignment = () => <PlateSolvingContainer />;
