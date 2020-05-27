import React from 'react';
import { Form, Header, Button, Message } from 'semantic-ui-react';
import ExposureInputContainer from './ExposureInputContainer';
import { SelectFilterContainer } from './SelectFilterContainer';
import { ImageViewOptionsContainer } from '../Image/ImageViewOptionsContainer';
import { CameraBinningContainer } from './CameraBinningContainer';

class FilterWheelSection extends React.Component {
    autosetFilterWheel = () => this.props.filterWheels.length === 1 && !this.props.currentFilterWheel && this.props.setFilterWheel(this.props.filterWheels[0].id);
    componentDidMount = () => this.autosetFilterWheel();
    componentDidUpdate = () => this.autosetFilterWheel();

    render = () => {
        const {filterWheels, currentFilterWheel, setFilterWheel} = this.props;
        return (
            <React.Fragment>
                <Header size='tiny' content='FilterWheel' textAlign='center' />
                <Button.Group vertical size='mini' fluid basic>
                { filterWheels.map(c => <Button
                    toggle
                    active={currentFilterWheel && currentFilterWheel.id === c.id}
                    key={c.id} content={c.name}
                    onClick={() => setFilterWheel(c.id)}
                />) }
                </Button.Group>
                { currentFilterWheel &&
                    <SelectFilterContainer filterWheelId={currentFilterWheel.id} />
                }
            </React.Fragment>
        )
    }
}

export class CameraShootingSectionMenuEntries extends React.Component {
    autosetCamera = () => this.props.cameras.length === 1 && !this.props.currentCamera && this.props.setCamera(this.props.cameras[0].id);
    componentDidMount = () => this.autosetCamera();
    componentDidUpdate = () => this.autosetCamera();
    render = () => {
        const {
            cameras,
            filterWheels,
            currentCamera,
            currentFilterWheel,
            setCamera,
            setFilterWheel,
            options,
            setOption,
            isShooting,
            onShoot,
        } = this.props;
        return cameras.length > 0 ? (
            <React.Fragment>
                <Header size='tiny' content='Camera' textAlign='center' />
                <Button.Group vertical size='mini' fluid basic>
                { cameras.map(c => <Button
                    toggle
                    active={currentCamera && currentCamera.id === c.id}
                    key={c.id} content={c.name}
                    onClick={() => setCamera(c.id)}
                />) }
                </Button.Group>
                { filterWheels.length > 0 &&
                    <FilterWheelSection {...{filterWheels, currentFilterWheel, setFilterWheel}} />
                }
                <Header size='tiny' content='Exposure' textAlign='center' />
                <Form.Field>
                    <ExposureInputContainer cameraId={currentCamera && currentCamera.id} disabled={!currentCamera || isShooting} size='mini' onShoot={onShoot} />
                    { !currentCamera && <Message content='Please select a camera first' size='tiny'/> }
                </Form.Field>
                <Form.Checkbox label='Continuous' disabled={!currentCamera} toggle size='mini' checked={options.continuous} onChange={(e, data) => setOption({continuous: data.checked})} />
                <CameraBinningContainer cameraId={currentCamera && currentCamera.id} />
            </React.Fragment>
        ) : null;
    }
}

export const CameraImageOptionsSectionMenuEntries = ({
    cameras,
    canCrop,
    crop,
    startCrop,
    resetCrop,
    imageId,
}) => cameras.length > 0 && (
    <React.Fragment>
        <ImageViewOptionsContainer imageId={imageId} imageType='camera' />
        <Header size='tiny' content='ROI' textAlign='center' />
        <Button content='select ROI' size='tiny' fluid basic disabled={!canCrop || !!crop} onClick={startCrop}/>
        <Button content='clear ROI' size='tiny' fluid basic disabled={!canCrop || !(!!crop && crop.pixel )} onClick={resetCrop}/>
        { crop && crop.pixel && ! crop.applied && <Message size='tiny' content='You need to shoot another image to see the new ROI applied' />}
        { crop && ! crop.pixel && crop.canceled && <Message size='tiny' content='You need to shoot another image to reset the ROI to full size' />}
    </React.Fragment>
)

