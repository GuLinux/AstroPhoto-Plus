import React from 'react';
import { connect } from 'react-redux';
import { ModalDialog } from '../Modals/ModalDialog';
import { NumericInput } from '../components/NumericInput';
import { Modal, Button, Form, Divider, Progress, Header, Container, Message, Label, Dropdown } from 'semantic-ui-react';
import { set } from 'lodash/fp'
import { getFieldOfView, getSensorSizeFromResolution } from '../PlateSolving/utils';
import { formatDecimalNumber } from '../utils';
import { Filesize } from '../components/Filesize';
import { cameraDropdownItemSelector, telescopeDropdownItemSelector } from './selectors';

const CameraDropdownItemContainer = connect(cameraDropdownItemSelector)(
    ({onClick, cameraId, cameraPixelWidth, cameraPixelPitch}) => 
        <Dropdown.Item content={cameraId} onClick={() => onClick(cameraPixelWidth, cameraPixelPitch)} />
);

const TelescopeDropdownItemContainer = connect(telescopeDropdownItemSelector)(
    ({onClick, telescopeId, focalLength}) => 
        <Dropdown.Item content={telescopeId} onClick={() => onClick(focalLength)} />
);
export class DownloadIndexesModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            calculateBy: 'sensor_size',
            focalLength: null,
            fov: null,
            sensorWidth: null,
            sensorResolution: null,
            sensorPixelSize: null,
        };
    }

    onFoVChanged = (value) => this.setState(set('fov', value, this.state));

    updateCalculator = () => {
        if(this.state.sensorWidth && this.state.focalLength) {
            this.setState(set('fov', getFieldOfView(this.state.focalLength, this.state.sensorWidth), this.state));
        }
    }

    updateSensorResolutionCalculator = () => {
        if(this.state.sensorResolution && this.state.sensorPixelSize) {
            this.setState(set('sensorWidth', getSensorSizeFromResolution(this.state.sensorResolution, this.state.sensorPixelSize), this.state), this.updateCalculator);
        }
    }

    onSensorResolutionChanged = value => this.setState(set('sensorResolution', value, this.state), this.updateSensorResolutionCalculator);

    onPixelSizeChanged = value => this.setState(set('sensorPixelSize', value, this.state), this.updateSensorResolutionCalculator);

    onFocalLengthChanged = value => this.setState(set('focalLength', value, this.state), this.updateCalculator);

    onSensorWidthChanged = value => this.setState(set('sensorWidth', value, this.state), this.updateCalculator);

    useSensorSize = () => this.setState(set('calculateBy', 'sensor_size', this.state));
    useSensorRes = () => this.setState(set('calculateBy', 'sensor_resolution', this.state));

    formatArchMinutes = value => formatDecimalNumber('%0.6f', value);

    renderTelescopeDropdownItem = item => <TelescopeDropdownItemContainer key={item} telescopeId={item} onClick={this.onFocalLengthChanged} />
    renderCameraDropdownItem = item => <CameraDropdownItemContainer key={item} cameraId={item} onClick={this.onCameraSelected} />

    onCameraSelected = (cameraPixelWidth, cameraPixelPitch) =>
        this.setState({...this.state, sensorResolution: cameraPixelWidth, sensorPixelSize: cameraPixelPitch}, this.updateSensorResolutionCalculator)

    render = () => (
        <ModalDialog closeOnEscape={false} trigger={this.props.trigger} centered={false} basic>
            <Modal.Header content='Download Astrometry.net index files' />
            <Modal.Content>
                { this.props.showProgress ? (
                    <Container>
                        <Header size='medium' content={this.props.isFinished ? 'Finished' : 'Downloading'} />
                        { this.props.currentFile && (
                            <React.Fragment>
                                <Header size='small' content={`Downloading ${this.props.currentFile}`} />
                                <Progress active autoSuccess={!this.props.currentFileError} error={this.props.currentFileError} value={this.props.downloaded} total={this.props.total}>
                                { this.props.downloaded && this.props.total && (
                                    <React.Fragment>
                                        <Filesize bytes={this.props.downloaded} /> of <Filesize bytes={this.props.total} />
                                    </React.Fragment>
                                )}
                                </Progress>
                            </React.Fragment>
                        )}
                        <Header size='small' content='Total progress' />
                        {
                            this.props.isFinished && ! this.props.allTotal ?
                            (
                                <Progress autoSuccess percent={100} label='Everything already downloaded.' />
                            )
                            :
                            (
                                <Progress active autoSuccess={!this.props.errors} error={this.props.errors} value={this.props.allDownloaded} total={this.props.allTotal}>
                                {   this.props.allDownloaded && this.props.allTotal && (
                                    <React.Fragment>
                                        <Filesize bytes={this.props.allDownloaded} /> of <Filesize bytes={this.props.allTotal} />
                                    </React.Fragment>
                                )}
                                </Progress>
                            )
                        }
                        {
                            this.props.errors && this.props.errors.map(
                                e => <Message size='small' key={e.file} error content={`Error downloading file ${e.file}: ${e.errorMessage}`} />
                            )
                        }
                        {
                            this.props.errors && <Message warning size='large' icon='exclamation' content='Some files failed downloading. Please try again later.' />
                        }
                    </Container>
                ) : (
                    <Form>
                        <Form.Field>
                            <label>Minimum field of view</label>
                            <NumericInput format={this.formatArchMinutes} labelPosition='right' label='arcminutes' value={this.state.fov || ''} onChange={this.onFoVChanged} />
                        </Form.Field>
                        <Divider />
                        <p>You can also use this calculator, entering the focal lenght of your <b>longest</b> telescope/lens, and the sensor information of your <b>smallest</b> camera.</p>
                        <Form.Field>
                            <label>Telescope focal length</label>
                            <NumericInput labelPosition='right' value={this.state.focalLength || ''} onChange={this.onFocalLengthChanged}>
                                { this.props.telescopes.length > 0 && (
                                    <Dropdown button text='Get from telescope...'>
                                        <Dropdown.Menu>
                                            {this.props.telescopes.map(this.renderTelescopeDropdownItem)}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                                <input />
                                <Label content='mm' />
                            </NumericInput>
                        </Form.Field>
                        <Form.Group grouped>
                            <Form.Radio toggle label='Use sensor size in mm' checked={this.state.calculateBy === 'sensor_size'} onChange={this.useSensorSize} />
                            <Form.Radio toggle label='Use sensor resolution and pixel size' checked={this.state.calculateBy === 'sensor_resolution'} onChange={this.useSensorRes} />
                        </Form.Group>
                        { this.state.calculateBy === 'sensor_size' && 
                            <Form.Field>
                                <label>Sensor size</label>
                                <NumericInput labelPosition='right' value={this.state.sensorWidth || ''} onChange={this.onSensorWidthChanged}>
                                { this.props.cameras.length > 0 && (
                                    <Dropdown button text='Get from camera...'>
                                        <Dropdown.Menu>
                                            {this.props.cameras.map(this.renderCameraDropdownItem)}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                                    <input />
                                    <Label content='mm' />
                                </NumericInput>
                            </Form.Field>
                        }
                        { this.state.calculateBy === 'sensor_resolution' && ( 
                            <Form.Group>
                                <Form.Field>
                                    <label>Sensor horizontal resolution</label>
                                    <NumericInput label='pixels' labelPosition='right' value={this.state.sensorResolution || ''} onChange={this.onSensorResolutionChanged} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Sensor pixel size</label>
                                    <NumericInput label='um' labelPosition='right' value={this.state.sensorPixelSize || ''} onChange={this.onPixelSizeChanged} />
                                </Form.Field>
                            </Form.Group>
                        )}
                    </Form>
                )
            }
            </Modal.Content>
            <Modal.Actions>
                <ModalDialog.CloseButton content='Close' disabled={this.props.isDownloading} onClose={this.onClose} />
                <Button primary content='Download' disabled={!this.canDownload()} onClick={this.download} />
            </Modal.Actions>
        </ModalDialog>
    )

    onClose = () => this.props.onClose();
    download = () => this.props.download(this.state.fov)
    canDownload = () => !!this.state.fov && ! this.props.isDownloading && ! this.props.isFinished;
}
