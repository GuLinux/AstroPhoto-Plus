import React from 'react';
import { connect } from 'react-redux';
import { getDARVSelector } from './selectors';
import { Container, Grid, Button } from 'semantic-ui-react';
import { CheckButton } from '../components/CheckButton';
import { CameraShootingSectionMenuEntriesContaner, CameraImageOptionsSectionMenuEntriesContainer } from '../Camera/CameraSectionMenuEntriesContainer.js';
import { startDARV, setDARVGuider } from './actions';
import CurrentImageViewerContainer from '../Camera/CurrentImageViewerContainer';
import AutoExposureContainer from '../Camera/AutoExposureContainer';
import { NotFoundPage } from '../components/NotFoundPage';


class DARVMenuContainer extends React.Component {
    onShoot = shootParams => {
        this.props.startDARV(shootParams);
        return false;
    }

    render = () => (
        <React.Fragment>
            <CameraShootingSectionMenuEntriesContaner onShoot={this.onShoot} />
            <CameraImageOptionsSectionMenuEntriesContainer />
        </React.Fragment>
    );
}


class DARVContainer extends React.Component {
    setGuider = guider => () => this.props.setDARVGuider(guider);

    renderGuiderButton = guider => <CheckButton key={guider} active={this.props.selectedGuider === guider} onClick={this.setGuider(guider)}>{guider}</CheckButton>;

    render = () => {
        const { options, cameras } = this.props;
        if(cameras.length === 0)
        return <NotFoundPage
            backToUrl='/indi/server'
            title='No camera found'
            message='Camera not found. Please double check that your INDI server is connected, with at least one connected camera.'
            backButtonText='INDI server page'
        />

        return (
            <Container fluid>
                <Container>
                    <Grid>
                        <Grid.Column width={3}>Autoguider interface</Grid.Column>
                        <Grid.Column width={13}>
                            <Button.Group size='mini'>
                                {this.renderGuiderButton('Manual')}
                                {this.props.guiders.map(this.renderGuiderButton)}
                            </Button.Group>
                        </Grid.Column>
                    </Grid>
                </Container>
                <AutoExposureContainer />
                <CurrentImageViewerContainer fitScreen={options.fitToScreen} />
            </Container>
        );
    }
}

export const DARVPolarAlignmentMenu = connect(null, {
    startDARV,
})(DARVMenuContainer);


export const DARV = connect(getDARVSelector, { setDARVGuider })(DARVContainer);

