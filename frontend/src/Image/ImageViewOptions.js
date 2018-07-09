import React from 'react';
import { Form, Input } from 'semantic-ui-react';

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


const ImageViewOptions = ({options, setOption}) => (
    <React.Fragment>
        <Form.Checkbox label='Auto histogram stretch' toggle size='mini' checked={options.stretch} onChange={(e, data) => setOption({stretch: data.checked})} />
        {
            !options.stretch && (<React.Fragment>
                <Form.Field key='shadows'>
                    <NumberInput name='clipLow' options={options} label='Clip shadows' min={0} max={100} step={0.1} onChange={ clipLow => setOption({clipLow}) } />
                </Form.Field>,
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
    </React.Fragment>
);

export default ImageViewOptions;

