import React from 'react';
import { connect } from 'react-redux';
import { CameraShootingSectionMenuEntriesContaner, CameraImageOptionsSectionMenuEntriesContainer } from '../Camera/CameraSectionMenuEntriesContainer.js';

import { PlateSolvingContainer } from '../PlateSolving/PlateSolvingContainer';
import { POLAR_DRIFT } from '../Camera/sections';

class PlatesolvingDriftMenuComponent extends React.Component {
    onShoot = shootParams => {
        //this.props.startDARV(shootParams);
        return false;
    }

    render = () => (
        <React.Fragment>
            <CameraShootingSectionMenuEntriesContaner onShoot={this.onShoot} section={POLAR_DRIFT} />
        </React.Fragment>
    );
}

export const PlatesolvingDriftMenu = connect(null, {})(PlatesolvingDriftMenuComponent);





export const PlateSolvingDrift = () => <PlateSolvingContainer />;
