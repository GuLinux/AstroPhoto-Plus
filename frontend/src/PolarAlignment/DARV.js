import React from 'react';
import { connect } from 'react-redux';
import { getDARVSelector, darvGuiderWarningsSelector } from './selectors';
import { Icon, Message, Divider, Container, Grid, Button, Accordion } from 'semantic-ui-react';
import { CheckButton } from '../components/CheckButton';
import { CameraShootingSectionMenuEntriesContaner, CameraImageOptionsSectionMenuEntriesContainer } from '../Camera/CameraSectionMenuEntriesContainer.js';
import { startDARV, setDARVGuider, notifyGuiderError } from './actions';
import CurrentImageViewerContainer from '../Camera/CurrentImageViewerContainer';
import { NotFoundPage } from '../components/NotFoundPage';
import { DARV_PAGE } from '../Camera/sections';


class DARVMenuComponent extends React.Component {
    onShoot = shootParams => {
        this.props.startDARV(shootParams);
        return false;
    }

    render = () => (
        <React.Fragment>
            <CameraShootingSectionMenuEntriesContaner onShoot={this.onShoot} section={DARV_PAGE} />
            <CameraImageOptionsSectionMenuEntriesContainer section={DARV_PAGE} />
        </React.Fragment>
    );
}

export const DARVPolarAlignmentMenu = connect(null, {
    startDARV,
})(DARVMenuComponent);



class DARVGuiderWarningsComponent extends React.Component {

    hasError = () => this.props.state === 'ALERT';

    componentDidUpdate = ({ state: prevState }) => prevState !== this.props.state && this.hasError() && this.notifyError();

    notifyError = () => this.props.notifyGuiderError(<p><b>Warning</b>: it looks like your autoguider device is having problems slewing your mount. Please check INDI server logs.</p>);

    render = () => null;
}


const DARVGuiderWarnings = connect(darvGuiderWarningsSelector, { notifyGuiderError })(DARVGuiderWarningsComponent);


class DARVComponent extends React.Component {
    state = {
        instructionsVisible: false,
    };

    toggleInstructions = () => this.setState({instructionsVisible: !this.state.instructionsVisible});

    setGuider = guider => () => this.props.setDARVGuider(guider);

    renderGuiderButton = guider => <CheckButton key={guider} active={this.props.guiderId === guider} onClick={this.setGuider(guider)} content={guider} />;

    guidingMessage = direction => {
        if(this.props.guiderId === 'Manual') {
            return (<span>Please start manually guiding in the <b>{direction}</ b> direction.</span>)
        }
        return (<span>Guiding in the <b>{direction}</b> direction.</span>);
    }

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
                    <Accordion>
                        <Accordion.Title active={this.state.instructionsVisible} onClick={this.toggleInstructions} ><Icon name='dropdown' className='dropdownRotationFix'/> Instructions</Accordion.Title>
                        <Accordion.Content active={this.state.instructionsVisible}>
                            <Message info>
                                <p>The <b>D.A.R.V.</b> Polar Alignment method is a variant of the well known Drift Polar Alignment. You can read more about the method itself in the <a href='https://www.cloudynights.com/articles/cat/articles/darv-drift-alignment-by-robert-vice-r2760' target='_blank'>original post</a> on CloudyNights.</p>
                                <p>On <i>AstroPhoto Plus</i> you can use any telescope mount that can be guided in the Right Ascension axis (included a Star Adventurer) by either using a serial connection to the mount, or a ST4 autoguider. If you don't have a USB Camera with an autoguider interface, you can still buy a ST4 to USB adapter. You can also guide manually, by follow the instructions on screen.</p>
                                <p>First point a region of the Sky as close as possible to the intersecion between the celestial equator and the meridian.</p>
                                <p>Select an autoguider interface (or Manual if you don't have one), start an exposure (minimum 30 seconds, recommended 120 seconds) and wait for the image to come back. Adjust the <b>azimuth</b> axis until the "V" shapes formed by stars converge to single lines.</p>
                                <p>Then point close to the horizon, either in the West or East direction, and repeat the process above, only adjusting in <b>altitude</b> now instead.</p>
                            </Message>
                            <Divider hidden />
                        </Accordion.Content>
                    </Accordion>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={3}>Autoguider interface</Grid.Column>
                            <Grid.Column width={13}>
                                <Button.Group size='mini'>
                                    {this.renderGuiderButton('Manual')}
                                    {this.props.guiders.map(this.renderGuiderButton)}
                                </Button.Group>
                            </Grid.Column>
                        </Grid.Row>
                        { this.props.darvStatus !== 'idle' && (
                        <Grid.Row>
                            <Grid.Column width={2} />
                            <Grid.Column width={4}>
                                <Message color='yellow'>Exposure started. Waiting 5 seconds for initial mark...</Message>
                            </Grid.Column>
                           <Grid.Column width={4}>
                                <Message hidden={['idle', 'started'].includes(this.props.darvStatus)} color='blue'>{this.guidingMessage('West')}</Message>
                            </Grid.Column>
                           <Grid.Column width={4}>
                                <Message hidden={this.props.darvStatus !== 'guiding_east'} color='green'>{this.guidingMessage('East')}</Message>
                            </Grid.Column>
                        </Grid.Row>
                        )}
                    </Grid>
                    <DARVGuiderWarnings guiderId={this.props.guiderId} />
                </Container>
                <Divider hidden />
                <CurrentImageViewerContainer fitScreen={options.fitToScreen} section={DARV_PAGE} />
            </Container>
        );
    }
}


export const DARV = connect(getDARVSelector, { setDARVGuider })(DARVComponent);

