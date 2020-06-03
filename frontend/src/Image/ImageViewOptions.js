import React from 'react';
import { Form, Header, Button } from 'semantic-ui-react';
import { NumericInput } from '../components/NumericInput';
export class ImageViewOptions extends React.Component{
    onStretchChanged = (e, data) => this.props.setOption({stretch: data.checked}, this.props.section);
    onFormatChanged = (e, data) => this.props.setOption({format: data.value}, this.props.section);
    onFitToScreenChanged = (e, data) => this.props.setOption({fitToScreen: data.checked}, this.props.section);
    onClipLowChanged = (value) => this.props.setOption({clipLow: value}, this.props.section);
    onClipHighChanged = (value) => this.props.setOption({clipHigh: value}, this.props.section);
    onShowHistogramChanged = (e, data) => this.props.setOption({showHistogram: data.checked}, this.props.section);
    onHistogramLogaritmicChanged = (e, data) => this.props.setOption({histogramLogarithmic: data.checked}, this.props.section);
    onHistogramBinsChanged = value => this.props.setOption({histogramBins: value}, this.props.section);

    render = () => (
        <React.Fragment>
            <Header size='tiny' content='View Options' textAlign='center' />
            <Form.Checkbox label='Auto histogram stretch' toggle size='tiny' checked={this.props.options.stretch} onChange={this.onStretchChanged} />
            {
                !this.props.options.stretch && (<React.Fragment>
                    <Form.Field key='shadows'>
                        <NumericInput value={this.props.options.clipLow} label='Clip shadows' min={0} max={100} step={0.1} onChange={this.onClipLowChanged} />
                    </Form.Field>
                    <Form.Field key='highlights'>
                        <NumericInput value={this.props.options.clipHigh} label='Clip highlights' min={0} max={100} step={0.1} onChange={this.onClipHighChanged} />
                    </Form.Field>
                </React.Fragment>)
            }

            <Form.Select basic labeled floating inline label='Display format' size='tiny' value={this.props.options.format} options={[
                { text: 'PNG', value: 'png'},
                { text: 'JPEG', value: 'jpeg' },
            ]} onChange={this.onFormatChanged}/>
            <Form.Checkbox label='Fit image to screen' toggle size='tiny' checked={this.props.options.fitToScreen} onChange={this.onFitToScreenChanged} />
            <Header size='tiny' content='Histogram' textAlign='center' />
            <Form.Checkbox label='Show histogram' toggle size='tiny' checked={this.props.options.showHistogram} onChange={this.onShowHistogramChanged} />
            {
                this.props.options.showHistogram && (<React.Fragment>
                    <Form.Checkbox key='log' label='logarithmic' toggle size='tiny' checked={this.props.options.histogramLogarithmic} onChange={this.onHistogramLogaritmicChanged} />
                    <Form.Field key='bins'>
                        <NumericInput label='bins' size='mini' min={0} max={255} step={1} value={this.props.options.histogramBins} onChange={this.onHistogramBinsChanged} />
                    </Form.Field>
                </React.Fragment>
            )}
            {this.props.imageId && <Button icon='download' content='Download FITS' as='a' target='_blank' href={`/api/images/${this.props.imageType}/${this.props.imageId}?format=original&download=true`} size='tiny' fluid/> }
        </React.Fragment>
    );
}


