import React from 'react';
import { Input } from 'semantic-ui-react';

const parseExposure = (exposure) => parseInt(exposure, 10);
const exposureValid = (exposure) => parseExposure(exposure) > 0;

const ExposureInput = ({shotParameters, onExposureChanged, onShoot, disabled}) => (
    <Input
        type='number'
        placeholder='seconds'
        size='tiny'
        onChange={(e, data) => onExposureChanged(parseExposure(data.value))}
        disabled={disabled}
        value={exposureValid(shotParameters.exposure) ? parseExposure(shotParameters.exposure) : ''}
        icon={{
            name: 'camera',
            circular: true,
            link: !disabled && exposureValid(shotParameters.exposure),
            disabled: disabled || ! exposureValid(shotParameters.exposure),
            onClick: () => onShoot(shotParameters),
        }}
    />
);

export default ExposureInput;
