import React from 'react';
import NumericInput from 'react-numeric-input';
import CommitPendingValuesButton from './CommitPendingValuesButton'
import INDILight from './INDILight'
import PRINTJ from 'printj'

// copied from INDI github repo: https://github.com/indilib/indi/blob/bda9177ef25c6a219ac3879994c6efcae3b2d1c6/libindi/libs/indicom.c#L117
// TODO: rewrite in a more modern/readable way
const sex2string = (format, value) => {
    let formatSpecifiers = format.substring(1, format.indexOf('m')).split('.').map(x => parseInt(x));
    let width = formatSpecifiers[0] - formatSpecifiers[1];
    let fracSpecifier = formatSpecifiers[1].toString();
    let fracBase = { 9: 360000, 8: 36000, 6: 3600, 5: 600, 4: 60 };
    fracBase = fracSpecifier in fracBase ? fracBase[fracSpecifier] : fracBase[4];

    let isNegative = parseInt(value) < 0;
    /* convert to an integral number of whole portions */
    let number = Math.trunc(Math.abs(value) * fracBase + 0.5);
    let d = Math.trunc(number / fracBase);
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
    switch (fracBase) {
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
const isFormattingenabled = true;


const isSexagesimal = format => format.endsWith('m')

const parseStringValue = (stringValue, format) => {
//    console.log(`parseStringValue called with ${stringValue}, ${format}`);
    stringValue = stringValue.trim();
    if(!isSexagesimal(format) || ! isSexagesimalEnabled)
        return parseFloat(stringValue);
    let tokens = stringValue.split(':');
    let degs = parseFloat(tokens[0]);
    let sign = stringValue.startsWith('-') ? -1 : 1;
    if(tokens.length > 1)
        degs += sign * parseFloat(tokens[1])/60;
    if(tokens.length > 2)
        degs += sign * parseFloat(tokens[2])/3600;
    console.log(`format: ${format}, string: ${stringValue}, parsed to: ${degs}`);
    return degs;
}



const formatValue = (displayValue, format) => {
    if(!isFormattingenabled)
        return displayValue;
    if(isSexagesimal(format)) {
        return isSexagesimalEnabled ? sex2string(format, displayValue) : displayValue;
    }
    let formatted = PRINTJ.sprintf(format, displayValue)
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
                        format={v => formatValue(v, value.format)}
                        parse={s => parseStringValue(s, value.format)}
                        />
                </div> 
            ))}
        </div>
        <div className="col-xs-1"><CommitPendingValuesButton bsStyle="primary" size="xsmall" device={device} isWriteable={isWriteable} pendingValues={pendingValues} commitPendingValues={commitPendingValues} property={property} /></div>
    </div>
)
 
export default INDINumberProperty
