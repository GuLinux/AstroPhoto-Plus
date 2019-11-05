import React from 'react';
import { connect } from 'react-redux';
import { Form} from 'semantic-ui-react';
import { phd2ProfilesSelector } from './selectors';
import { phd2SetProfile } from './actions';

class PHD2DevicesProfilesComponent extends React.Component {

    onProfileSelected = (evt, element) => this.props.phd2SetProfile(element.value);

    render = () => {
        const { profiles, selectedProfile, equipmentConnected } = this.props;
        return (
            <Form>
                <Form.Group inline>
                    <Form.Dropdown options={profiles} value={selectedProfile} onChange={this.onProfileSelected} />
                </Form.Group>
            </Form>
        );
    }
}

export const PHD2DevicesProfiles = connect(phd2ProfilesSelector, {
    phd2SetProfile,
})(PHD2DevicesProfilesComponent);

