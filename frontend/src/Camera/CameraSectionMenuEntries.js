import React from 'react';
import { Form, Header, Button, Message } from 'semantic-ui-react';
import ExposureInputContainer from './ExposureInputContainer';
import { SelectFilterContainer } from './SelectFilterContainer';
import { ImageViewOptionsContainer } from '../Image/ImageViewOptionsContainer';
import { CameraBinningContainer } from './CameraBinningContainer';

class FilterWheelSection extends React.Component {
    autosetFilterWheel = () => this.props.filterWheels.length === 1 && !this.props.currentFilterWheel && this.props.setFilterWheel(this.props.filterWheels[0].id, this.props.section);
    componentDidMount = () => this.autosetFilterWheel();
    componentDidUpdate = () => this.autosetFilterWheel();

    setFilterWheel = (id) => () => this.props.setFilterWheel(id, this.props.section);

    filterWheelButton = ({name, id}) => <Button
        toggle
        active={this.props.currentFilterWheel && this.props.currentFilterWheel.id === id}
        key={id} content={name}
        onClick={this.setFilterWheel(id, this.props.section)}
    />;

    render = () => {
        const {filterWheels, currentFilterWheel, section} = this.props;
        if(filterWheels.length === 0) {
            return null;
        }
        return (
            <React.Fragment>
                <Header size='tiny' content='FilterWheel' textAlign='center' />
                <Button.Group vertical size='mini' fluid basic>
                { filterWheels.map(this.filterWheelButton)}
                </Button.Group>
                { currentFilterWheel && <SelectFilterContainer filterWheelId={currentFilterWheel.id} section={section} /> }
            </React.Fragment>
        )
    }
}

export class CameraShootingSectionMenuEntries extends React.Component {
    autosetCamera = () => this.props.cameras.length === 1 && !this.props.currentCamera && this.props.setCamera(this.props.cameras[0].id, this.props.section);
    componentDidMount = () => this.autosetCamera();
    componentDidUpdate = () => this.autosetCamera();
    setCamera = id => () => this.props.setCamera(id, this.props.section);

    cameraButton = ({id, name}) => <Button
        toggle
        active={this.props.currentCamera && this.props.currentCamera.id === id}
        key={id} content={name}
        onClick={this.setCamera(id)}
    />

    render = () => {
        const {
            cameras,
            filterWheels,
            currentCamera,
            currentFilterWheel,
            setCamera,
            setFilterWheel,
            options,
            isShooting,
            onShoot,
            section,
        } = this.props;
        if(cameras.length === 0) {
            return null;
        }
        return (
            <React.Fragment>
                <Header size='tiny' content='Camera' textAlign='center' />
                <Button.Group vertical size='mini' fluid basic>
                { cameras.map(this.cameraButton) }
                </Button.Group>
                <FilterWheelSection {...{filterWheels, currentFilterWheel, setFilterWheel}} section={section} />
                <Header size='tiny' content='Exposure' textAlign='center' />
                <Form.Field>
                    <ExposureInputContainer cameraId={currentCamera && currentCamera.id} disabled={!currentCamera || isShooting} size='mini' onShoot={onShoot} section={section} />
                    { !currentCamera && <Message content='Please select a camera first' size='tiny'/> }
                </Form.Field>
                <Form.Checkbox label='Continuous' disabled={!currentCamera} toggle size='mini' checked={options.continuous} onChange={this.setContinuous} />
                <CameraBinningContainer cameraId={currentCamera && currentCamera.id} section={section} />
            </React.Fragment>
        );
    }

    setContinuous = (e, {checked: continuous}) => this.props.setOption({continuous}, this.props.section);
}

export class CameraImageOptionsSectionMenuEntries extends React.Component {
    startCrop = () => this.props.startCrop(this.props.section);
    resetCrop = () => this.props.resetCrop(this.props.section);

    render = () => {
        const {
            cameras,
            canCrop,
            crop,
            imageId,
            section,
        } = this.props;
        return cameras.length > 0 && (
            <React.Fragment>
                <ImageViewOptionsContainer imageId={imageId} imageType='camera' section={section} />
                <Header size='tiny' content='ROI' textAlign='center' />
                <Button content='select ROI' size='tiny' fluid basic disabled={!canCrop || !!crop} onClick={this.startCrop}/>
                <Button content='clear ROI' size='tiny' fluid basic disabled={!canCrop || !(!!crop && crop.pixel )} onClick={this.resetCrop}/>
                { crop && crop.pixel && ! crop.applied && <Message size='tiny' content='You need to shoot another image to see the new ROI applied' />}
                { crop && ! crop.pixel && crop.canceled && <Message size='tiny' content='You need to shoot another image to reset the ROI to full size' />}
            </React.Fragment>
        );
    }
}

