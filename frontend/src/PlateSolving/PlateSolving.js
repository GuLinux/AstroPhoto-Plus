import React from 'react';
import { Icon, Segment, Dropdown, Popup, List, Loader, Label, Grid, Container, Header, Button, Divider, Message } from 'semantic-ui-react';
import { CheckButton } from '../components/CheckButton';
import { PlateSolving as PlateSolvingActions } from './actions';
import { UploadFileDialog } from '../components/UploadFileDialog';
import { NumericInput } from '../components/NumericInput';
import { SkyChartComponent } from '../components/SkyChartsComponent';
import { get } from 'lodash';
import { getFieldOfView, getSensorSizeFromResolution } from './utils';
import { CatalogSearch } from '../Catalogs/CatalogSearch.js';

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

const field2Marker = (field, label, color) => ({
    ra: field.ra,
    dec: field.dec,
    width: field.widthDegrees,
    height: field.heightDegrees,
    rotate: -1.0 *field.orientation,
    unit: 'deg',
    shape: 'rect',
    label: label,
    marker_opts: {
        stroke: color,
        'fill-opacity': 0,
    },
    label_offset: 10,
    label_opts: {
        stroke: color,
    },
})

const SolutionPanel = ({solution, previousSolution, targets}) => {
    const markers = [
        field2Marker(solution, 'Plate Solving solution', 'red'),
        ...targets.map(target => (target.type === 'solution' ? field2Marker(target, target.id, 'green') : {
            ra: target.raj2000/15.0,
            dec: target.dej2000,
            radius: 10,
            label: target.displayName,
            marker_opts: {
                stroke: 'green',
                'fill-opacity': 0,
            },
            label_offset: 10,
            label_opts: {
                stroke: 'green',
            },
        }))
    ];
    if(previousSolution) {
        markers.push(field2Marker(previousSolution, 'Previous Solution', 'orange'));
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
                    { solution.orientation && (
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
            <SkyChartComponent center={{ra: solution.ra, dec: solution.dec}} fov={solution.widthDegrees * 10} form={true} markers={markers} starsColor='white' />
        </Container>
    );
}


export class PlateSolving extends React.Component {
    state = {};

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

    telescopeDriverButton = id => this.optionButton(Options.telescope, id, { content: this.driver('telescopes', id).name, key: id });
    cameraButton = id => this.optionButton(Options.fovSource, id, {content: this.driver('cameras', id).name, key: id});

    onFileUploaded = fileBuffer => this.props.solveField({
        ...this.props.options,
        fileBuffer,
    })

    onTargetFileUploaded = (fileBuffer, file) => {
            this.props.solveField({
            ...this.props.options,
            fileBuffer,
        }, file.name);
        this.toggleSearchTarget();
    }


    render = () => {
        const { telescopes, cameras, messages, options, setOption, solution, previousSolution, loading, isManualFOV } = this.props;
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
                <Grid.Row>
                    <Grid.Column width={3} verticalAlign='middle'><Header size='tiny' content='Targets'/></Grid.Column>
                    <Grid.Column width={13}>{this.renderTargets()}</Grid.Column>
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
            { solution && <SolutionPanel solution={solution} previousSolution={previousSolution} targets={this.props.targets} /> }
            {messages && messages.length > 0 && <PlateSolvingMessagesPanel messages={messages} /> }
        </Container>
        );
    }

    renderTargetSearch = () => (
        <React.Fragment>
            <Segment>
                <CatalogSearch sectionKey='platesolving' onObjectSelected={this.addTargetObject} clearOnSelected={true} />
            </Segment>
            <Segment>
                <UploadFileDialog
                    title='Upload FITS'
                    trigger={<Button icon='upload' content='Upload existing FITS as target' primary size='mini'/>}
                    readAsDataURL={true}
                    onFileUploaded={this.onTargetFileUploaded}
                />
            </Segment>
        </React.Fragment>
    );

    renderTargets = () => (this.state.showTargetSearch && ! this.props.loading) ? this.renderTargetSearch() : this.renderTargetsList();

    renderTargetsList = () => (
        <React.Fragment>
            <List horizontal>
                {this.props.targets.map(target => this.renderTarget(target))}
                {this.addTargetListItem()}
            </List>
            {this.props.mainTarget && this.targetSolvingOptions()}
        </React.Fragment>
    );

    renderTarget = target => (
        <List.Item key={target.id}>
            <List.Header>{target.displayName}</List.Header>
            <Button.Group size='mini'>
                {this.props.mainTarget === target.id && <Popup content='Main target' trigger={<Button icon={<Icon color='green' name='checkmark' />} basic disabled={this.props.loading} />} /> }
                {this.props.mainTarget !== target.id && <Popup content='Set as main target' trigger={<Button icon='target' basic onClick={() => this.props.setMainTarget(target.id)} disabled={this.props.loading} />} /> }
                <Popup content='Remove' trigger={<Button icon='remove' basic onClick={() => this.props.removeTarget(target.id)} disabled={this.props.loading} />} />
            </Button.Group>
        </List.Item>
    );

    addTargetListItem = () => (
        <List.Item key='add-target'>
            <Button size='mini' icon='add' onClick={this.toggleSearchTarget} disabled={this.props.loading} />
        </List.Item>
    );

    toggleSearchTarget = () => this.setState({ showTargetSearch: !this.state.showTargetSearch });

    addTargetObject = object => {
        this.props.addTargetObject(object);
        this.toggleSearchTarget();
    }

    targetSolvingOptions = () => {
        const options = [1, 5, 10, 20, 50, 90].map(degs => ({
            key: degs,
            text: degs,
            value: degs,
        }));
        const searchRadius = this.props.options[Options.searchRadius];
        return <div>Platesolving only around <Dropdown onChange={this.setSearchRadius} inline options={options} defaultValue={searchRadius} /> degrees from the selected target.</div>
    };

    setSearchRadius = (e, d) => this.props.setOption(Options.searchRadius, d.value);
}

