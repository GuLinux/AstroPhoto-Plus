import React from 'react';
import { NotFoundPage } from '../components/NotFoundPage';
import { Dimmer, Loader, Label, Grid, Container, Header, Button} from 'semantic-ui-react';
import { CheckButton } from '../components/CheckButton';
import { PlateSolving as PlateSolvingActions } from './actions';
import UploadFileDialog from '../components/UploadFileDialog';
import INDIMessagesPanel from '../INDI-Server/INDIMessagesPanel';
import { NumericInput } from '../components/NumericInput';
import { formatDecimalNumber } from '../utils';

const { Options } = PlateSolvingActions;

// TODO: possibly move some driver selection in the menu
export const PlateSolvingSectionMenu = ({}) => null;

class SetCameraFOV extends React.Component {
    componentDidMount = () => this.setFOV();
    componentDidUpdate = (prevProps) => this.props.camera !== prevProps.camera && this.setFOV();
    setFOV = () => {
        const { setOption, camera, telescope } = this.props;
        const { ccdInformation } = camera;
        const telescopeInformation = telescope.info;
        const sensorWidth = (ccdInformation.CCD_MAX_X.value * ccdInformation.CCD_PIXEL_SIZE_X.value) / 1000;
        const focalLength = telescopeInformation.TELESCOPE_FOCAL_LENGTH.value;
        const fieldOfView = 60 * 2 * Math.atan(sensorWidth / (2 * focalLength) ) / (Math.PI / 180);
        const fovRange = { minimumWidth: fieldOfView * 0.9, maximumWidth: fieldOfView * 1.1 };
        setOption(Options.fov, fovRange);
    }
    render = () => null;
}

const toSexagesimal = value => {
    const degrees = parseInt(value);
    let remainder = Math.abs(60 * (value - degrees));
    const minutes = parseInt(remainder);
    remainder = 60 * (remainder - minutes);
    const seconds = parseInt(remainder);
    return { degrees, minutes, seconds, fractionalSeconds: remainder };
}

const formatDegrees = degrees => {
    const sexagesimal = toSexagesimal(degrees);
    return `${sexagesimal.degrees}\u00B0 ${sexagesimal.minutes}' ${formatDecimalNumber('%0.2f', sexagesimal.fractionalSeconds)}"`;
}

const formatRA = degrees => {
    const hours = degrees * (24.0/360.0);
    const sexagesimal = toSexagesimal(hours);
    return `${sexagesimal.degrees}:${sexagesimal.minutes}:${formatDecimalNumber('%0.2f', sexagesimal.fractionalSeconds)}`;
}

const SolutionField = ({field, width=11, format = v => v}) => ( <React.Fragment>
    <Grid.Column width={4}><Label content={field.label} /></Grid.Column>
    <Grid.Column width={width}>{format(field.value)}</Grid.Column>
</React.Fragment>
);

const formatAladinParams = (solution) => {
    const ra = toSexagesimal(solution.ASTROMETRY_RESULTS_RA.value * (24.0 / 360.0));
    const dec = toSexagesimal(solution.ASTROMETRY_RESULTS_DE.value);
    const decSign = dec.degrees >= 0 ? '+' : ''
    return 'target=' +
        encodeURI(`${ra.degrees} ${ra.minutes} ${formatDecimalNumber('%0.3f', ra.fractionalSeconds)}` +
        `${decSign}${dec.degrees} ${dec.minutes} ${formatDecimalNumber('%0.2f', dec.fractionalSeconds)}`) +
        '&fov=' + encodeURI(formatDecimalNumber('%0.2f', solution.ASTROMETRY_RESULTS_WIDTH.value * 5));
}

const SolutionPanel = ({solution}) => (
    <Container text>
        <Header content='Solution' />
        <Grid stackable>
            <Grid.Row>
                <SolutionField width={3} field={solution.ASTROMETRY_RESULTS_RA} format={formatRA} />
                <SolutionField width={3} field={solution.ASTROMETRY_RESULTS_DE} format={formatDegrees} />
            </Grid.Row>
            <Grid.Row>
                <SolutionField width={3} field={solution.ASTROMETRY_RESULTS_WIDTH} format={formatDegrees} />
                <SolutionField width={3} field={solution.ASTROMETRY_RESULTS_HEIGHT} format={formatDegrees} />
            </Grid.Row>
            <Grid.Row>
                <SolutionField width={3} field={solution.ASTROMETRY_RESULTS_PIXSCALE} format={v => formatDecimalNumber('%0.2f', v)} />
            </Grid.Row>
            <Grid.Row>
                <SolutionField width={3} field={solution.ASTROMETRY_RESULTS_ORIENTATION} format={v => formatDecimalNumber('%0.2f', v)} />
            </Grid.Row>
            <Grid.Row>
                <a href={`http://aladin.unistra.fr/AladinLite/?${formatAladinParams(solution)}&survey=P/DSS2/color`} target='_blank'>Aladin solution</a>
            </Grid.Row>
        </Grid>
    </Container>
)

class PlateSolving extends React.Component {

    componentDidMount = () => {
        this.setDefaultDevice(Options.telescope, this.props.telescopes);
        this.setDefaultDevice(Options.astrometryDriver, this.props.astrometryDrivers);
        if(! this.props.options[Options.fovSource]) {
            this.props.setOption(Options.fovSource, false);
        }
    }

    setDefaultDevice = (option, devices) => {
        if(!this.props.options[option] && devices.length === 1) {
            this.props.setOption(option, devices.all[0].id);
        }
    }

    optionButton = (option, value, props={}) => 
        <CheckButton disabled={ props.disabled || this.props.loading} size='mini' active={this.props.options[option] === value} onClick={() => this.props.setOption(option, value)} {...props} />

    render = () => {
        const { astrometryDrivers, telescopes, cameras, messages, options, setOption, solution, loading} = this.props;
        const setFOV = (valueObject) => setOption(Options.fov, {...options[Options.fov], ...valueObject});
        const isManualFOV = options[Options.fovSource] === 'manual';

        return (
        <Container>
            <Header content='Plate Solver options' />
            <Grid stackable>
            { astrometryDrivers.length > 1 && (
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Astrometry driver' /></Grid.Column>
                    <Grid.Column width={11}>
                        { astrometryDrivers.all.map(d => this.optionButton(Options.astrometryDriver, d.id, { content: d.name, key: d.id})) }
                    </Grid.Column>
                </Grid.Row>
            )}
            { telescopes.length > 1 && (
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Telescope' /></Grid.Column>
                    <Grid.Column width={11}>
                        { telescopes.all.map(d => this.optionButton(Options.telescope, d.id, { content: d.name, key: d.id })) }
                    </Grid.Column>
                </Grid.Row>
            )}
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Sync telescope on solve'/></Grid.Column>
                    <Grid.Column width={11}>
                        {this.optionButton(Options.syncTelescope, false, {content: 'Off'})}
                        {this.optionButton(Options.syncTelescope, true, {content: 'On'})}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Solve camera shot'/></Grid.Column>
                    <Grid.Column width={11}>
                        {this.optionButton(Options.camera, false, {content: 'Off'})}
                        {this.optionButton(Options.camera, true, {content: 'On'})}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Downsample image'/></Grid.Column>
                    <Grid.Column width={11}>
                        {this.optionButton(Options.downsample, false, {content: 'Off'})}
                        {this.optionButton(Options.downsample, 2, {content: '2'})}
                        {this.optionButton(Options.downsample, 3, {content: '3'})}
                        {this.optionButton(Options.downsample, 4, {content: '4'})}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Field of View'/></Grid.Column>
                    <Grid.Column width={11}>
                        {this.optionButton(Options.fovSource, false, {content: 'Off'})}
                        {this.optionButton(Options.fovSource, 'manual', {content: 'Manual'})}
                        { cameras.length > 0 && cameras.all.map(c => this.optionButton(Options.fovSource, c.id, {content: c.name, key: c.id}))}
                        { cameras.ids.includes(options[Options.fovSource]) && <SetCameraFOV camera={cameras.get(options[Options.fovSource])} telescope={telescopes.get(options[Options.telescope])} setOption={setOption} /> }
                        { options[Options.fovSource] && (
                        <Grid.Row>
                            <Grid.Column width={8}><NumericInput label='Minimum width (arcminutes)' size='mini' readOnly={!isManualFOV || loading } disabled={!isManualFOV || loading } value={options[Options.fov].minimumWidth} onChange={v => setFOV({minimumWidth: v})}/></Grid.Column>
                            <Grid.Column width={8}><NumericInput label='Maximum width (arcminutes)' size='mini' readOnly={!isManualFOV || loading } disabled={!isManualFOV || loading } value={options[Options.fov].maximumWidth} onChange={v => setFOV({maximumWidth: v})}/></Grid.Column>
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
                                onFileUploaded={fileBuffer => {
                                    this.props.solveField({
                                        ...this.props.options,
                                        fileBuffer,
                                        })
                                    }
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
               )}
                { loading && (<Grid.Row>
                    <Grid.Column width={16} textAlign='center'>
                        <Loader active inline />
                    </Grid.Column>
                </Grid.Row>)}
            </Grid>


            { solution && <SolutionPanel solution={solution} /> }
            {messages && <INDIMessagesPanel messages={messages} />}
        </Container>
        );
    }
}

export const PlateSolvingPage = ({astrometryDrivers, telescopes, ...props}) => {
    if(astrometryDrivers.all.length === 0)
        return <NotFoundPage
            backToUrl='/indi/server'
            title='No Astrometry driver found'
            message='Astrometry drivers not found. Please double check that your INDI server is connected, with at least one connected astrometry device.'
            backButtonText='INDI server page'
        />;
    if(telescopes.all.length === 0)
        return (<NotFoundPage
            backToUrl='/indi/server'
            title='No telescopes found'
            message={null}
            backButtonText='INDI server page'
            >
                <div>
                    <p>
                        You need to connect at least a telescope to use this functionality. 
                    </p>
                    <p>
                        Please double check that your INDI server is connected, with at least a connected telescope device.
                    </p>
                    <p>
                        {'If you don\'t have one, or you have a manual mount, you can use the "Telescope Simulator" driver.'}
                    </p>
                </div>
        </NotFoundPage>)
        return <PlateSolving {...{astrometryDrivers, telescopes, ...props}} />
}
