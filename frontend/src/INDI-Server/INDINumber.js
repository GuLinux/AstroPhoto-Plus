import React from 'react';
//import NumericInput from 'react-numeric-input';

import { sprintf } from 'printj'
import { formatDecimalNumber } from '../utils';
import { NumericInput } from '../components/NumericInput';
import { get } from 'lodash';

// copied from INDI github repo: https://github.com/indilib/indi/blob/bda9177ef25c6a219ac3879994c6efcae3b2d1c6/libindi/libs/indicom.c#L117
// TODO: rewrite in a more modern/readable way
const sex2string = (format, value) => {
    let formatSpecifiers = format.substring(1, format.indexOf('m')).split('.').map(x => parseInt(x, 10));
    let width = formatSpecifiers[0] - formatSpecifiers[1];
    let fracSpecifier = formatSpecifiers[1].toString();
    let fracBase = { 9: 360000, 8: 36000, 6: 3600, 5: 600, 4: 60 };
    fracBase = fracSpecifier in fracBase ? fracBase[fracSpecifier] : fracBase[4];

    let isNegative = parseInt(value, 10) < 0;
    /* convert to an integral number of whole portions */
    let number = Math.trunc(Math.abs(value) * fracBase + 0.5);
    let d = Math.trunc(number / fracBase);
    let f = number % fracBase;
    let out = "";
    let m;
    let s;

    /* form the whole part; "negative 0" is a special case */
    if (isNegative && d === 0)
        out += sprintf("%*s-0", width - 2, "");
    else
        out += sprintf("%*d", width, isNegative ? -d : d);

    /* do the rest */
    switch (fracBase) {
        case 60: /* dd:mm */
            m = f / (fracBase / 60);
            out += sprintf(":%02d", m);
            break;
        case 600: /* dd:mm.m */
            out += sprintf(":%02d.%1d", f / 10, f % 10);
            break;
        case 3600: /* dd:mm:ss */
            m = f / (fracBase / 60);
            s = f % (fracBase / 60);
            out += sprintf(":%02d:%02d", m, s);
            break;
        case 36000: /* dd:mm:ss.s*/
            m = f / (fracBase / 60);
            s = f % (fracBase / 60);
            out += sprintf(":%02d:%02d.%1d", m, s / 10, s % 10);
            break;
        case 360000: /* dd:mm:ss.ss */
            m = f / (fracBase / 60);
            s = f % (fracBase / 60);
            out += sprintf(":%02d:%02d.%02d", m, s / 100, s % 100);
            break;
        default:
            return value;
    }
    return out.trim()
}
// end INDI code


const isSexagesimal = format => format.endsWith('m')

const parseStringValue = (stringValue, format) => {
    stringValue = stringValue.trim();
    if(!isSexagesimal(format))
        return parseFloat(stringValue);
    let tokens = stringValue.split(':');
    let degs = parseFloat(tokens[0]);
    let sign = stringValue.startsWith('-') ? -1 : 1;
    if(tokens.length > 1)
        degs += sign * parseFloat(tokens[1])/60;
    if(tokens.length > 2)
        degs += sign * parseFloat(tokens[2])/3600;
    return degs;
}



const formatValue = (displayValue, format) => {
    if(isSexagesimal(format)) {
        return sex2string(format, displayValue);
    }
    let formatted = formatDecimalNumber(format, displayValue)
    return formatted;
}

// TODO: revisit when https://github.com/vlad-ignatov/react-numeric-input/pull/80 gets merged

const EditableInput = ({value, format, min, max, step, onChange, ...args}) => (
    <NumericInput
        value={value}
        onChange={onChange}
        size='small'
        className='indi-number'
        format={v => formatValue(v, format)}
        parse={s => parseStringValue(s, format)}
        min={min}
        max={max}
        step={step}
        {...args}
    />
)

const CurrentValue = ({value, format, ...args}) => (
    <NumericInput
        value={value}
        size='small'
        readOnly={true}
        className='indi-number'
        format={v => formatValue(v, format)}
        parse={s => parseStringValue(s, format)}
        {...args}
    />
)

export class INDINumber extends React.PureComponent {
    componentDidMount = () => this.props.onMount && this.props.onMount(this.props.value);

    getDisplayValue = () => get(this.props, 'displayValue', this.props.value.value);

    onChange = (value) => this.props.onChange({[this.props.value.name]: value});

    render = () => {
        const {value, editMode} = this.props;
        if(editMode) {
            return (
                <EditableInput
                    min={value.min} max={value.max} step={value.step}
                    label={value.label}
                    format={value.format}
                    value={this.getDisplayValue()}
                    fluid
                    onChange={this.onChange}
                />

            )
        }
        return <CurrentValue format={value.format} label={value.label} value={value.value} fluid />
    }
}


