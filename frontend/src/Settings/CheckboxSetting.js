import React from 'react';
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react';
import { update } from './actions';
import { getCheckboxSettingSelector } from './selectors';
import { CheckButton } from '../components/CheckButton';


class CheckboxSettingComponent extends React.Component {
    onChanged = (e, d) => this.props.update({ [this.props.setting]: d.checked });

    checkboxProps = () => {
        const { update, ...props } = this.props;
        return props;
    }
    render = () => <Form.Checkbox
        onChange={this.onChanged}
        {...this.checkboxProps()}
    />;

}

export const CheckboxSetting = connect(getCheckboxSettingSelector, {update})(CheckboxSettingComponent);

