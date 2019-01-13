import React from 'react';
import { Form, Input, Header } from 'semantic-ui-react';

const TIMER_SECONDS = 1.5 * 1000;

class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: props.options[props.name] };
    }

    onChange = (e, {value} ) => {
        clearTimeout(this.state.timer);
        const timer = setTimeout(() => this.onTimer(), TIMER_SECONDS);
        this.setState({...this.state, value, timer})
    }

    onTimer = () => {
        this.setState({...this.state, timer: undefined});
        this.props.onChange(this.state.value);
    }

    render = () => {
        const { min, max, step, label } = this.props;
        return (
            <Input
                type='number'
                size='tiny'
                min={min}
                max={max}
                step={step}
                value={this.state.value}
                onChange={(e, d) => this.onChange(e, d)}
                label={label}
            />
        )
    }
}

const HistogramSectionMenuEntries = ({
    options,
    setOption,
}) => (
    <React.Fragment>
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

    </React.Fragment>
)
export const ImageViewOptions = ({options, setOption}) => (
    <React.Fragment>
        <Header size='tiny' content='View Options' textAlign='center' />
        <Form.Checkbox label='Auto histogram stretch' toggle size='tiny' checked={options.stretch} onChange={(e, data) => setOption({stretch: data.checked})} />
        {
            !options.stretch && (<React.Fragment>
                <Form.Field key='shadows'>
                    <NumberInput name='clipLow' options={options} label='Clip shadows' min={0} max={100} step={0.1} onChange={ clipLow => setOption({clipLow}) } />
                </Form.Field>
                <Form.Field key='highlights'>
                    <NumberInput name='clipHigh' options={options} label='Clip highlights' min={0} max={100} step={0.1} onChange={ clipHigh => setOption({clipHigh}) } />
                </Form.Field>
            </React.Fragment>)
        }

        <Form.Select basic labeled floating inline label='Display format' size='tiny' value={options.format} options={[
            { text: 'PNG', value: 'png'},
            { text: 'JPEG', value: 'jpeg' },
        ]} onChange={(e, data) => setOption({format: data.value})}/>
        <Form.Checkbox label='Fit image to screen' toggle size='tiny' checked={options.fitToScreen} onChange={(e, data) => setOption({fitToScreen: data.checked})} />
        <HistogramSectionMenuEntries setOption={setOption} options={options} />
    </React.Fragment>
);


