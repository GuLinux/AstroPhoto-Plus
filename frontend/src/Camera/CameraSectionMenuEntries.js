import React from 'react';
import { Form, Header, Button, Message, Input } from 'semantic-ui-react';
import ExposureInputContainer from './ExposureInputContainer';
import { SelectFilterContainer } from './SelectFilterContainer';
import ImageViewOptions from '../Image/ImageViewOptions';

class FilterWheelSection extends React.Component {
    autosetFilterWheel = () => this.props.filterWheels.length === 1 && !this.props.currentFilterWheel && this.props.setCurrentFilterWheel(this.props.filterWheels[0].id);
    componentDidMount = () => this.autosetFilterWheel();
    componentDidUpdate = () => this.autosetFilterWheel();

    render = () => {
        const {filterWheels, currentFilterWheel, setCurrentFilterWheel} = this.props;
        return (
            <React.Fragment>
                <Header size='tiny' content='FilterWheel' textAlign='center' />
                <Button.Group vertical size='mini' fluid basic>
                { filterWheels.map(c => <Button
                    toggle
                    active={currentFilterWheel && currentFilterWheel.id === c.id}
                    key={c.id} content={c.name}
                    onClick={() => setCurrentFilterWheel(c.id)}
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
    autosetCamera = () => this.props.cameras.length === 1 && !this.props.currentCamera && this.props.setCurrentCamera(this.props.cameras[0].id);
    componentDidMount = () => this.autosetCamera();
    componentDidUpdate = () => this.autosetCamera();
    render = () => {
        const {
            cameras,
            filterWheels,
            currentCamera,
            currentFilterWheel,
            setCurrentCamera,
            setCurrentFilterWheel,
            options,
            setOption,
            isShooting,
        } = this.props;
        return cameras.length > 0 ? (
            <React.Fragment>
                <Header size='tiny' content='Camera' textAlign='center' />
                <Button.Group vertical size='mini' fluid basic>
                { cameras.map(c => <Button
                    toggle
                    active={currentCamera && currentCamera.id === c.id}
                    key={c.id} content={c.name}
                    onClick={() => setCurrentCamera(c.id)}
                />) }
                </Button.Group>
                { filterWheels.length > 0 &&
                    <FilterWheelSection {...{filterWheels, currentFilterWheel, setCurrentFilterWheel}} />
                }
                <Header size='tiny' content='Exposure' textAlign='center' />
                <Form.Field>
                    <ExposureInputContainer cameraId={currentCamera && currentCamera.id} disabled={!currentCamera || isShooting} size='tiny' />
                    { !currentCamera && <Message content='Please select a camera first' size='tiny'/> }
                </Form.Field>
                <Form.Checkbox label='Continuous' disabled={!currentCamera} toggle size='mini' checked={options.continuous} onChange={(e, data) => setOption({continuous: data.checked})} />
            </React.Fragment>
        ) : null;
    }
}

export const CameraImageOptionsSectionMenuEntries = ({
    cameras,
    options,
    setOption,
    canCrop,
    crop,
    startCrop,
    resetCrop,
}) => cameras.length > 0 && (
    <React.Fragment>
        <Header size='tiny' content='View Options' textAlign='center' />
        <ImageViewOptions options={options} setOption={setOption} />
        <Header size='tiny' content='Histogram' textAlign='center' />
        <Form.Checkbox label='Show histogram' toggle size='tiny' checked={options.showHistogram} onChange={(e, data) => setOption({showHistogram: data.checked})} />
        {
            options.showHistogram && (<React.Fragment>
                <Form.Checkbox
                    key='log'
                    label='logarithmic'
                    toggle
                    size='tiny'
                    checked={options.histogramLogarithmic}
                    onChange={(e, data) => setOption({histogramLogarithmic: data.checked})}
                    />
                <Form.Field key='bins'>
                    <Input
                        type='number'
                        label='bins'
                        size='tiny'
                        min={0}
                        max={255}
                        value={options.histogramBins}
                        onChange={(e, data) => setOption({histogramBins: data.value})}
                        />
                </Form.Field>
            </React.Fragment>)
        }
        <Header size='tiny' content='ROI' textAlign='center' />
        <Button content='select ROI' size='tiny' fluid basic disabled={!canCrop || !!crop} onClick={startCrop}/>
        <Button content='clear ROI' size='tiny' fluid basic disabled={!canCrop || !(!!crop && crop.pixel )} onClick={resetCrop}/>
        { crop && crop.pixel && ! crop.applied && <Message size='tiny' content='You need to shoot another image to see the new ROI applied' />}
        { crop && ! crop.pixel && crop.canceled && <Message size='tiny' content='You need to shoot another image to reset the ROI to full size' />}
    </React.Fragment>
)

