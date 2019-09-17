import React from 'react';
import { Loader, Label, Grid, Container, Header, Button, Divider, Message} from 'semantic-ui-react';
import { CheckButton } from '../components/CheckButton';
import { PlateSolving as PlateSolvingActions } from './actions';
import { UploadFileDialog } from '../components/UploadFileDialog';
import { INDIMessagesPanel } from '../INDI-Server/INDIMessagesPanel';
import { NumericInput } from '../components/NumericInput';
import { formatDecimalNumber } from '../utils';
import { SkyChartComponent } from '../components/SkyChartsComponent';
import { get } from 'lodash';
import { getFieldOfView, getSensorSizeFromResolution } from './utils';

const { Options } = PlateSolvingActions;

const MINIMUM_DRIVERS_CHOICE = 1;
const PlateSolvingMessage = (message, index) => <Message.Item key={index} content={message} />;

const PlateSolvingMessagesPanel = ({messages}) => (
    <Message>
        <Message.Header content='Messages' />
        <Message.List>
             {messages.map(PlateSolvingMessage)}
        </Message.List>
    </Message>
);


class SetCameraFOV extends React.PureComponent {
    componentDidMount = () => this.setFOV();
    componentDidUpdate = (prevProps) => this.props.camera !== prevProps.camera && this.setFOV();
    setFOV = () => {
        const { setOption, telescopeFocalLength, ccdInfo } = this.props;
        const sensorWidth = getSensorSizeFromResolution(ccdInfo.ccdMaxX, ccdInfo.ccdPixelSizeX);
        const fieldOfView = getFieldOfView(telescopeFocalLength, sensorWidth);
        const fovRange = { minimumWidth: fieldOfView * 0.95, maximumWidth: fieldOfView * 1.05 };
        setOption(Options.fov, fovRange);
    }
    render = () => null;
}

const SolutionField = ({label, value, width=11}) => (
    <React.Fragment>
        <Grid.Column width={4}><Label content={label} /></Grid.Column>
        <Grid.Column width={width}>{value}</Grid.Column>
    </React.Fragment>
);

const SolutionPanel = ({solution, previousSolution}) => {
    const markers = [
        {
            ra: solution.ra,
            dec: solution.dec,
            radius: 10,
            label: 'Plate Solving solution',
            marker_opts: {
                stroke: 'red',
                'fill-opacity': 0,
            },
            label_opts: {
                stroke: 'red',
            },
        },
    ];
    if(previousSolution) {
        markers.push({
            ra: previousSolution.ra,
            dec: previousSolution.dec,
            radius: 10,
            label: 'Previous solution',
            marker_opts: {
                stroke: 'orange',
                'fill-opacity': 0,
            },
            label_opts: {
                stroke: 'orange',
            },

        });
    }
    return (
        <Container>
            <Container text>
                <Header content='Solution' />
                <Grid stackable>
                    <Grid.Row>
                        <SolutionField width={3} label='RA (J2000)' value={solution.raLabel} />
                        <SolutionField width={3} label='DEC (J2000)' value={solution.decLabel} />
                    </Grid.Row>
                    <Grid.Row>
                        <SolutionField width={3} label='Field width' value={solution.width} />
                        <SolutionField width={3} label='Field height' value={solution.height} />
                    </Grid.Row>
                    <Grid.Row>
                        <SolutionField width={3} label='Scale (arcsec/pixel)' value={solution.pixScale} />
                    </Grid.Row>
                    { solution.ASTROMETRY_RESULTS_ORIENTATION && (
                    <Grid.Row>
                        <SolutionField width={3} label='Orientation (East of North)' value={solution.orientation} />
                    </Grid.Row>
                    )}
                    <Grid.Row>
                        <Grid.Column width={4}><Label content='Link to Aladin' /></Grid.Column>
                        <Grid.Column width={5}><a href={solution.aladinURL} rel='noopener noreferrer' target='_blank'>click here</a></Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
            <Divider hidden />
            <SkyChartComponent center={{ra: solution.ra, dec: solution.dec}} initialFoV={solution.widthDegrees * 10} form={true} markers={markers} />
        </Container>
    );
}


export class PlateSolving extends React.PureComponent {

    componentDidMount = () => {
        this.setDefaultDevice(Options.telescope, this.props.telescopes);
        if(! this.props.options[Options.fovSource]) {
            this.props.setOption(Options.fovSource, false);
        }
    }

    setDefaultDevice = (option, devices) => {
        if(!this.props.options[option] && devices.length === 1) {
            this.props.setOption(option, devices.ids[0]);
        }
    }

    optionButton = (option, value, props={}) => 
        <CheckButton disabled={ props.disabled || this.props.loading} size='mini' active={this.props.options[option] === value} onClick={() => this.props.setOption(option, value)} {...props} />

    setMinimumFOV = minimumWidth => {
        const maximumWidth = Math.max(minimumWidth+1, this.props.options[Options.fov].maximumWidth || 0);
        this.props.setOption(Options.fov, {...this.props.options[Options.fov], minimumWidth, maximumWidth});
    }

    setMaximumFOV = maximumWidth => {
        const minimumWidth = Math.min(maximumWidth-1, this.props.options[Options.fov].minimumWidth || 0);
        this.props.setOption(Options.fov, {...this.props.options[Options.fov], maximumWidth, minimumWidth });
    }

    driver = (type, id) => this.props[type].entities[id];

    astrometryDriverButton = id => this.optionButton(Options.astrometryDriver, id, { content: this.driver('astrometryDrivers', id).name, key: id});
    telescopeDriverButton = id => this.optionButton(Options.telescope, id, { content: this.driver('telescopes', id).name, key: id });
    cameraButton = id => this.optionButton(Options.fovSource, id, {content: this.driver('cameras', id).name, key: id});

    onFileUploaded = fileBuffer => this.props.solveField({
        ...this.props.options,
        fileBuffer,
        })

    render = () => {
        const { astrometryDrivers, telescopes, cameras, messages, options, setOption, solution, previousSolution, loading, isManualFOV, abortSolveField } = this.props;
        return (
        <Container>
            <Header content='Plate Solver options' />
            <Grid stackable>
            { telescopes.length > MINIMUM_DRIVERS_CHOICE && (
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Telescope' /></Grid.Column>
                    <Grid.Column width={13}>
                        { telescopes.ids.map(this.telescopeDriverButton)}
                    </Grid.Column>
                </Grid.Row>
            )}
            {this.props.telescopeFocalLength && (
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Telescope focal length' /></Grid.Column>
                    <Grid.Column width={13}>
                        {this.props.telescopeFocalLength}mm
                    </Grid.Column>
                </Grid.Row>)}
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Sync telescope on solve'/></Grid.Column>
                    <Grid.Column width={13}>
                        {this.optionButton(Options.syncTelescope, false, {content: 'Off'})}
                        {this.optionButton(Options.syncTelescope, true, {content: 'On'})}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Solve camera shot'/></Grid.Column>
                    <Grid.Column width={13}>
                        {this.optionButton(Options.camera, false, {content: 'Off'})}
                        {this.optionButton(Options.camera, true, {content: 'On'})}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Downsample image'/></Grid.Column>
                    <Grid.Column width={13}>
                        {this.optionButton(Options.downsample, false, {content: 'Off'})}
                        {this.optionButton(Options.downsample, 2, {content: '2'})}
                        {this.optionButton(Options.downsample, 3, {content: '3'})}
                        {this.optionButton(Options.downsample, 4, {content: '4'})}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Field of View'/></Grid.Column>
                    <Grid.Column width={13}>
                        {this.optionButton(Options.fovSource, false, {content: 'Off'})}
                        {this.optionButton(Options.fovSource, 'manual', {content: 'Manual'})}
                        { cameras.length > 0 && cameras.ids.map(this.cameraButton)}
                        { cameras.ids.includes(options[Options.fovSource]) &&
                            <SetCameraFOV
                                ccdInfo={this.props.ccdInfo}
                                telescopeFocalLength={this.props.telescopeFocalLength}
                                setOption={setOption}
                            /> }
                            { options[Options.fovSource] ? (
                                <Grid.Row>
                                <Grid.Column width={8}>
                                    <NumericInput
                                        min={0}
                                        label='Minimum width (arcminutes)'
                                        size='mini'
                                        readOnly={!isManualFOV || loading }
                                        disabled={!isManualFOV || loading }
                                        value={get(options, [Options.fov, 'minimumWidth'], 0)}
                                        onChange={this.setMinimumFOV}
                                    />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <NumericInput
                                        min={0}
                                        label='Maximum width (arcminutes)'
                                        size='mini'
                                        readOnly={!isManualFOV || loading }
                                        disabled={!isManualFOV || loading }
                                        value={get(options, [Options.fov, 'maximumWidth'], 0)}
                                        onChange={this.setMaximumFOV}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            ) : (
                                <Grid.Row>
                                    <Message
                                        size='tiny'
                                        compact
                                        icon='warning'
                                        content='Please note that plate solving an image without selecting a field of view can be very slow, depending on your server capabilities.'
                                    />
                                </Grid.Row>
                            )}
                    </Grid.Column>
                </Grid.Row>
                { !options[Options.camera] && (
                    <Grid.Row>
                        <Grid.Column width={16} textAlign='center'>
                            <UploadFileDialog
                                title='Upload FITS'
                                trigger={<Button disabled={loading} icon='upload' content='Upload FITS' primary size='mini'/>}
                                readAsDataURL={true}
                                onFileUploaded={this.onFileUploaded}
                            />
                        </Grid.Column>
                    </Grid.Row>
            )}
                { loading && (<Grid.Row>
                    <Grid.Column width={8} textAlign='center'>
                        <Loader active inline />
                    </Grid.Column>
                </Grid.Row>)}
            </Grid>
            { solution && <SolutionPanel solution={solution} previousSolution={previousSolution} /> }
            {messages && messages.length > 0 && <PlateSolvingMessagesPanel messages={messages} /> }
        </Container>
        );
    }
}

