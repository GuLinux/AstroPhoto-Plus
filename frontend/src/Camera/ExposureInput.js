import React from 'react';
import { Input, Button, Icon } from 'semantic-ui-react';
import PRINTJ from 'printj'
import { NumericInput } from '../components/NumericInput';

const parseExposure = (exposure) => parseFloat(exposure);
const exposureValid = (exposure) => parseExposure(exposure) > 0;
const isNumber = (exposure) => !isNaN(parseExposure(exposure));


const ExposureShootIcon = ({disabled, onClick, isShooting, size}) => (
    <Button as='a' content='Shoot' icon={<Icon name={isShooting ? 'spinner' : 'camera'} loading={isShooting}/>} disabled={disabled} size={size} onClick={onClick} />
)

const getValue = (isShooting, shotParameters, cameraExposureValue) => {
    if(isShooting && cameraExposureValue) {
        return PRINTJ.sprintf(cameraExposureValue.format, cameraExposureValue.value).trim();
    }
    return isNumber(shotParameters.exposure) ? parseExposure(shotParameters.exposure) : ''
}

const ExposureInput = ({shotParameters, cameraExposureValue, onExposureChanged, onShoot, disabled, isShooting, size='tiny'}) => (
    <NumericInput
        placeholder='seconds'
        size={size}
        min={cameraExposureValue ? cameraExposureValue.min : null}
        max={cameraExposureValue ? cameraExposureValue.max : null}
        step={cameraExposureValue ? cameraExposureValue.step: null}
        format={(v) => cameraExposureValue ? PRINTJ.sprintf(cameraExposureValue.format, v).trim() : ''}
        parse={(v) => parseFloat(v)}
        onChange={(exposure) => onExposureChanged(exposure)}
        disabled={disabled}
        value={getValue(isShooting, shotParameters, cameraExposureValue)}
        fluid
        label={
            <ExposureShootIcon size={size} compact isShooting={isShooting} disabled={disabled || ! exposureValid(shotParameters.exposure)} onClick={() => onShoot(shotParameters)} />
        }
        labelPosition='right'
    />
);

export default ExposureInput;
