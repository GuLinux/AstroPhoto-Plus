import React from 'react';
import { Dropdown } from 'semantic-ui-react';

export class InputActions extends React.Component {
    
    render = () => {
        const {currentValue, pendingValue, resetSetting, customButtons=null} = this.props;
        const isChanged = currentValue !== pendingValue;
        return (
            <Dropdown direction='left' button basic floating icon='ellipsis horizontal'>
                <Dropdown.Menu>
                    {customButtons}
                    <Dropdown.Item content='update' disabled={!isChanged} onClick={this.updateSetting} />
                    <Dropdown.Item content='reset' onClick={resetSetting} disabled={!isChanged}/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    updateSetting = () => this.props.updateSetting(this.props.setting, this.props.pendingValue);
}

