import React from 'react';
import { Input, Button } from 'semantic-ui-react';

const parseExposure = (exposure) => parseInt(exposure, 10);
const exposureValid = (exposure) => parseExposure(exposure) > 0;

const ExposureShootIcon = ({disabled, onClick}) => (
    <Button as='a' content='Shoot' icon='camera' disabled={disabled} size='tiny' onClick={onClick} />
)

const ExposureInput = ({shotParameters, onExposureChanged, onShoot, disabled}) => (
    <Input
        type='number'
        placeholder='seconds'
        size='tiny'
        onChange={(e, data) => onExposureChanged(parseExposure(data.value))}
        disabled={disabled}
        value={exposureValid(shotParameters.exposure) ? parseExposure(shotParameters.exposure) : ''}
        label={
            <ExposureShootIcon disabled={disabled || ! exposureValid(shotParameters.exposure)} onClick={() => onShoot(shotParameters)} />
        }
        labelPosition='right'
    />
);

export default ExposureInput;
