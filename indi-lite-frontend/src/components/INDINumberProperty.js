import React from 'react';
import NumericInput from 'react-numeric-input';
import CommitPendingValuesButton from './CommitPendingValuesButton'
import INDILight from './INDILight'
import PRINTJ from 'printj'

// copied from INDI github repo: https://github.com/indilib/indi/blob/bda9177ef25c6a219ac3879994c6efcae3b2d1c6/libindi/libs/indicom.c#L117
// TODO: rewrite in a more modern/readable way
const sex2string = (format, value) => {
    // %010.6m
    // 0.0008388807046051948 => 0:00:03
    // 22.2061 => 22:12:22

    let formatSpecifiers = format.substring(1, format.indexOf('m')).split('.').map(x => parseInt(x));
    let width = formatSpecifiers[0] - formatSpecifiers[1];
    let fracSpecifier = formatSpecifiers[1];
    let fracBase;

    switch(fracSpecifier) {
        case 9:
            fracBase = 360000;
            break;
        case 8:
            fracBase = 36000;
            break;
        case 6:
            fracBase = 3600;
            break;
        case 5:
            fracBase = 600;
            break;
        default:
            fracBase = 60;
            break;
    }

    let isNegative = parseInt(value) < 0;
    let a = isNegative ? Math.abs(value) : value;

    /* convert to an integral number of whole portions */
    let number = Math.trunc(a * fracBase + 0.5);
    let d = number / fracBase;
    let f = number % fracBase;
    let out = "";
    let m;
    let s;

    /* form the whole part; "negative 0" is a special case */
    if (isNegative && d == 0)
        out += PRINTJ.sprintf("%*s-0", width - 2, "");
    else
        out += PRINTJ.sprintf("%*d", width, isNegative ? -d : d);

    /* do the rest */
    switch (fracBase)
    {
        case 60: /* dd:mm */
            m = f / (fracBase / 60);
            out += PRINTJ.sprintf(":%02d", m);
            break;
        case 600: /* dd:mm.m */
            out += PRINTJ.sprintf(":%02d.%1d", f / 10, f % 10);
            break;
        case 3600: /* dd:mm:ss */
            m = f / (fracBase / 60);
            s = f % (fracBase / 60);
            out += PRINTJ.sprintf(":%02d:%02d", m, s);
            break;
        case 36000: /* dd:mm:ss.s*/
            m = f / (fracBase / 60);
            s = f % (fracBase / 60);
            out += PRINTJ.sprintf(":%02d:%02d.%1d", m, s / 10, s % 10);
            break;
        case 360000: /* dd:mm:ss.ss */
            m = f / (fracBase / 60);
            s = f % (fracBase / 60);
            out += PRINTJ.sprintf(":%02d:%02d.%02d", m, s / 100, s % 100);
            break;
        default:
            return value;
    }
    return out.trim()
}

// end INDI code

const isSexagesimalEnabled = false
const isFormattingenabled = false;

const isSexagesimal = format => isSexagesimalEnabled && format.endsWith('m')

const formatValue = (value, displayValue) => {
    if(!isFormattingenabled)
        return displayValue;
    if(isSexagesimal(value.format)) {
        return sex2string(value.format, displayValue);
    }
    let formatted = PRINTJ.sprintf(value.format, displayValue)
    return formatted;
}

const INDINumberProperty = ({device, property, isWriteable, pendingValues, displayValues, addPendingValues, commitPendingValues }) => (
    <div className="row">
        <div className="col-xs-1"><INDILight state={property.state} /></div> 
        <div className="col-xs-2">{property.label}</div> 
        <div className="col-xs-8">
            {property.values.map(value => (
                <div className="row" key={value.name} >
                    <div className="col-xs-2"><p>{value.label}</p></div>
                    <NumericInput
                        className="col-xs-10"
                        min={value.min}
                        max={value.max}
                        step={value.step}
                        name={value.name}
                        value={displayValues[value.name]}
                        onChange={(numValue, stringValue) => addPendingValues(device, property, { [value.name]: numValue })}
                        readOnly={!isWriteable}
                        format={n => formatValue(value, displayValues[value.name])}
                        />
                </div> 
            ))}
        </div>
        <div className="col-xs-1"><CommitPendingValuesButton bsStyle="primary" size="xsmall" device={device} isWriteable={isWriteable} pendingValues={pendingValues} commitPendingValues={commitPendingValues} property={property} /></div>
    </div>
)
 
export default INDINumberProperty
