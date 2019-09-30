import React from 'react';
import { Label } from 'semantic-ui-react';

export const ValueChangedWarning = ({currentValue, pendingValue}) => {
    if(currentValue !== pendingValue) {
        return (
            <Label color='yellow' pointing>
                This settings is not saved. Please click the Save button to apply it.
            </Label>
        );
    }
    return null;
};

